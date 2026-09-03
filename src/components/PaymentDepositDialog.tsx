import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { initializePaystackPayment } from "@/lib/api/paystack.functions";
import { markPaymentAttemptAbandoned } from "@/lib/api/payment-status.functions";
import { trackEvent } from "@/lib/analytics";
import { NIGERIA_VAT_RATE, PRICE_NAIRA_PER_USD, type SupportedCurrency } from "@/lib/currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PaymentDepositDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
  currency: SupportedCurrency;
};

const PLAN_PRICES: Record<string, { ngn: number; usd: number }> = {
  Starter: { ngn: 150_000, usd: 150 },
  Business: { ngn: 250_000, usd: 250 },
  "E-commerce": { ngn: 500_000, usd: 500 },
  Professional: { ngn: 1_200_000, usd: 1_200 },
};

export function PaymentDepositDialog({
  open,
  onOpenChange,
  plan,
  currency,
}: PaymentDepositDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">("full");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const planPrice = PLAN_PRICES[plan];
  const fullAmount = planPrice ? (currency === "NGN" ? planPrice.ngn : planPrice.usd) : 0;
  const subtotal = paymentOption === "deposit" ? fullAmount / 2 : fullAmount;
  const vatAmount = currency === "NGN" ? subtotal * NIGERIA_VAT_RATE : 0;
  const totalAmount = subtotal + vatAmount;
  const checkoutNaira = currency === "NGN" ? totalAmount : subtotal * PRICE_NAIRA_PER_USD;

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setName("");
    setPaymentOption("full");
    setError("");
    setSubmitting(false);
  }, [open, plan]);

  useEffect(() => {
    const resetAfterReturningToPage = () => {
      if (!open) return;
      const reference = window.sessionStorage.getItem("savans-pending-payment-reference");
      if (reference) {
        window.sessionStorage.removeItem("savans-pending-payment-reference");
        void markPaymentAttemptAbandoned({ data: { reference } });
      }
      setSubmitting(false);
      setError("Payment was not completed. You can try again when ready.");
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") resetAfterReturningToPage();
    };

    window.addEventListener("pageshow", resetAfterReturningToPage);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", resetAfterReturningToPage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [open]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedName = name.trim();
    if (!planPrice || !normalizedName || !normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter your name and a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    trackEvent("paystack_payment_start", {
      plan,
      paymentOption,
      currency,
      amount: subtotal,
      emailDomain: normalizedEmail.split("@")[1] ?? "unknown",
    });
    try {
      const result = await initializePaystackPayment({
        data: { email: normalizedEmail, name: normalizedName, plan, currency, paymentOption },
      });
      window.sessionStorage.setItem("savans-pending-payment-reference", result.reference);
      window.location.assign(result.authorizationUrl);
    } catch (initError) {
      console.error(initError);
      setError("Payment could not be started. Try again or contact us directly.");
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm outline-none focus:border-foreground/40 transition";
  const labelClass = "text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your payment</DialogTitle>
          <DialogDescription>Pay in full, or start with a 50% project deposit.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <PaymentOption
              checked={paymentOption === "full"}
              label="Pay in full"
              amount={formatAmount(fullAmount, currency)}
              onClick={() => setPaymentOption("full")}
            />
            <PaymentOption
              checked={paymentOption === "deposit"}
              label="Pay 50% deposit"
              amount={formatAmount(fullAmount / 2, currency)}
              onClick={() => setPaymentOption("deposit")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Deposits are fixed at 50% and cannot be reduced.
          </p>
          <div>
            <label className={labelClass} htmlFor="paystack-name">
              Name
            </label>
            <input
              id="paystack-name"
              type="text"
              required
              maxLength={120}
              className={inputClass}
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="paystack-email">
              Email
            </label>
            <input
              id="paystack-email"
              type="email"
              required
              maxLength={255}
              className={inputClass}
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="rounded-xl border border-border bg-card/40 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex justify-between gap-4">
              <span>{paymentOption === "full" ? "Full project price" : "50% deposit"}</span>
              <span>{formatAmount(subtotal, currency)}</span>
            </div>
            {currency === "NGN" && (
              <div className="mt-1 flex justify-between gap-4">
                <span>VAT (7.5%)</span>
                <span>{formatAmount(vatAmount, currency)}</span>
              </div>
            )}
            {currency === "USD" && (
              <div className="mt-1 flex justify-between gap-4">
                <span>Paystack checkout charge</span>
                <span>{formatAmount(checkoutNaira, "NGN")}</span>
              </div>
            )}
            {currency === "USD" && (
              <p className="mt-2 text-xs">International checkout accepts card payments only.</p>
            )}
            <div className="mt-2 flex justify-between gap-4 border-t border-border pt-2 font-medium text-foreground">
              <span>Total due</span>
              <span>{formatAmount(totalAmount, currency)}</span>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Starting payment..."
              : `Continue to Paystack — ${formatAmount(totalAmount, currency)}`}
            {!submitting && <ArrowRight className="size-4" />}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PaymentOption({
  checked,
  label,
  amount,
  onClick,
}: {
  checked: boolean;
  label: string;
  amount: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left text-sm transition ${checked ? "border-foreground bg-card" : "border-border bg-card/40 hover:bg-card"}`}
    >
      <span className="block font-medium">{label}</span>
      <span className="mt-1 block text-xs text-muted-foreground">{amount}</span>
    </button>
  );
}
function formatAmount(amount: number, currency: SupportedCurrency) {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

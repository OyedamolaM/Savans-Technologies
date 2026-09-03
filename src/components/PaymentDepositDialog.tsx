import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { initializePaystackPayment } from "@/lib/api/paystack.functions";
import { trackEvent } from "@/lib/analytics";
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
  defaultAmount?: number;
};

export function PaymentDepositDialog({
  open,
  onOpenChange,
  plan,
  defaultAmount,
}: PaymentDepositDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setEmail("");
    setName("");
    setAmount(defaultAmount ? String(defaultAmount) : "");
    setError("");
    setSubmitting(false);
  }, [open, defaultAmount]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const normalizedEmail = email.trim();
    const normalizedName = name.trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedEmail.includes("@") ||
      !parsedAmount ||
      parsedAmount <= 0
    ) {
      setError("Enter your name, a valid email, and amount.");
      return;
    }

    setError("");
    setSubmitting(true);
    trackEvent("paystack_payment_start", {
      plan,
      name: normalizedName,
      amount: Math.round(parsedAmount),
      emailDomain: normalizedEmail.split("@")[1] ?? "unknown",
    });

    try {
      const result = await initializePaystackPayment({
        data: {
          email: normalizedEmail,
          name: normalizedName,
          amount: parsedAmount,
          plan,
        },
      });

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
          <DialogTitle>Pay deposit</DialogTitle>
          <DialogDescription>
            Start a {plan ? `${plan} project` : "project"} payment with Paystack.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
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
          <div>
            <label className={labelClass} htmlFor="paystack-amount">
              Amount (NGN)
            </label>
            <input
              id="paystack-amount"
              type="number"
              required
              min={100}
              step={100}
              max={100_000_000}
              className={inputClass}
              placeholder="150000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Starting payment..." : "Continue to Paystack"}
            {!submitting && <ArrowRight className="size-4" />}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

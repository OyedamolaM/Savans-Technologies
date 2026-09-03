import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";

import { getAdminPaymentHistory } from "@/lib/api/payments.functions";
import { logoutCurrentUser } from "@/lib/api/auth.functions";
import { clearSessionToken, getSessionToken } from "@/lib/session-client";

type PaymentRecord = {
  reference: string;
  status: "success";
  amountNaira: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  plan?: string;
  paidAt: string;
};

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment History | Savans Technologies" },
      { name: "description", content: "View payment history recorded by Savans Technologies." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const loadPayments = async () => {
    const token = getSessionToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const result = await getAdminPaymentHistory({ data: { token } });
      if (!result.authed) {
        clearSessionToken();
        setLoading(false);
        return;
      }

      setAuthed(true);
      setPayments(result.payments);
    } catch (loadError) {
      console.error(loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayments();
  }, []);

  const onLogout = async () => {
    const token = getSessionToken();
    if (token) {
      await logoutCurrentUser({ data: { token } }).catch(() => undefined);
    }
    clearSessionToken();
    window.location.assign("/savansadminlogin");
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-5xl text-sm text-muted-foreground">Loading payments...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto size-12 rounded-xl gradient-brand grid place-items-center text-background">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Admin login required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with the admin account to view payment history.
          </p>
          <a
            href="/savansadminlogin"
            className="mt-6 inline-flex items-center justify-center rounded-full gradient-brand text-background font-medium px-6 py-3 text-sm"
          >
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to site
            </a>
            <h1 className="mt-3 text-2xl font-bold">Payment History</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Recorded Paystack payments from this app.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-sm font-medium hover:bg-card transition"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>

        {payments.length > 0 ? (
          <div className="mt-8 overflow-x-auto glass rounded-2xl">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.reference} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(payment.paidAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div>{payment.customerName ?? "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{payment.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">{payment.plan ?? "-"}</td>
                    <td className="px-4 py-3">{formatNaira(payment.amountNaira)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground break-all">
                      {payment.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No successful payments recorded yet.</p>
        )}
      </div>
    </div>
  );
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

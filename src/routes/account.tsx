import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";

import { getCustomerAccount } from "@/lib/api/payments.functions";
import { logoutCurrentUser } from "@/lib/api/auth.functions";
import { clearSessionToken, getSessionToken } from "@/lib/session-client";

type PaymentRecord = {
  reference: string;
  status: "success";
  amountNaira: number;
  currency: string;
  plan?: string;
  paidAt: string;
};

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account | Savans Technologies" },
      { name: "description", content: "View your payment history and project deposits." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [email, setEmail] = useState("");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const token = getSessionToken();

    if (!token) {
      setLoading(false);
      return;
    }

    void getCustomerAccount({ data: { token } })
      .then((result) => {
        if (!result.authed) {
          clearSessionToken();
          return;
        }

        setEmail(result.email);
        setPayments(result.payments);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const onLogout = async () => {
    const token = getSessionToken();
    if (token) {
      await logoutCurrentUser({ data: { token } }).catch(() => undefined);
    }
    clearSessionToken();
    setLoggedOut(true);
    window.location.assign("/login");
  };

  const inputClass =
    "w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm outline-none focus:border-foreground/40 transition";

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-4xl text-sm text-muted-foreground">Loading account...</div>
      </div>
    );
  }

  if (!email && !loggedOut) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <div className="text-xl font-bold">My Account</div>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to see your payment history.</p>
          <a
            href="/login"
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
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to site
            </a>
            <div className="mt-3 flex items-center gap-3">
              <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                <UserRound className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Account</h1>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
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

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Payment history</h2>

          {payments.length === 0 ? (
            <div className="mt-4 glass rounded-2xl p-5 text-sm text-muted-foreground">
              No successful payments linked to this account yet. If you paid before creating an
              account, contact us so we can link it.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto glass rounded-2xl">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
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
          )}
        </div>
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

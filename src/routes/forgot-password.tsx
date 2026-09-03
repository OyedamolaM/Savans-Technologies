import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";

import { sendPasswordResetLink } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password | Savans Technologies" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await sendPasswordResetLink({ data: { email: email.trim() } });
      if (!result.ok) {
        setError("No account found for this email.");
        return;
      }
      setSent(true);
    } catch (sendError) {
      console.error(sendError);
      setError("Reset email could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm outline-none focus:border-foreground/40 transition";
  const labelClass = "text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        <a href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to login
        </a>
        <div className="mt-6 glass-strong rounded-2xl p-6 sm:p-8">
          <h1 className="text-xl font-bold">Forgot password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we will send a reset link.
          </p>

          {sent ? (
            <p className="mt-6 text-sm text-muted-foreground">
              If the email exists, a password reset link is on its way.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div>
                <label className={labelClass} htmlFor="forgot-email">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:opacity-60"
              >
                <Mail className="size-4" />
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

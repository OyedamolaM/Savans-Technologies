import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";

import { resetCustomerPassword } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password | Savans Technologies" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    setLoading(true);

    try {
      const result = await resetCustomerPassword({ data: { token, password } });
      if (!result.ok) {
        setError("This reset link is invalid or has expired.");
        return;
      }
      setDone(true);
    } catch (resetError) {
      console.error(resetError);
      setError("Password reset could not be completed.");
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
          {done ? (
            <div className="text-center">
              <div className="mx-auto size-12 rounded-xl gradient-brand grid place-items-center text-background">
                <CheckCircle2 className="size-6" />
              </div>
              <h1 className="mt-4 text-xl font-bold">Password updated</h1>
              <a
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-full gradient-brand text-background font-medium px-6 py-3 text-sm"
              >
                Go to login
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Reset password</h1>
                  <p className="text-xs text-muted-foreground">Choose a new password.</p>
                </div>
              </div>
              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <div>
                  <label className={labelClass} htmlFor="reset-password">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClass}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="reset-confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={inputClass}
                    placeholder="Repeat password"
                    required
                    minLength={8}
                  />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex items-center justify-center rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

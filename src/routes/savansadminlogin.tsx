import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { loginUser } from "@/lib/api/auth.functions";
import { setSessionToken } from "@/lib/session-client";

export const Route = createFileRoute("/savansadminlogin")({
  head: () => ({
    meta: [{ title: "Admin Login | Savans Technologies" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        data: { role: "admin", email: email.trim(), password },
      });

      if (!result.ok) {
        setError("Invalid admin email or password.");
        return;
      }

      setSessionToken(result.token);
      window.location.assign("/payments");
    } catch (loginError) {
      console.error(loginError);
      setError("Admin login could not be completed.");
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
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to site
        </a>

        <div className="mt-6 glass-strong rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Login</h1>
              <p className="text-xs text-muted-foreground">Private staff access.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className={labelClass} htmlFor="admin-email">
                Admin email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                placeholder="admin@savanstech.com"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Login as admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

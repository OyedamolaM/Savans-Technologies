import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, Mail, UserRoundPlus } from "lucide-react";

import { loginUser, registerCustomerUser } from "@/lib/api/auth.functions";
import { setSessionToken } from "@/lib/session-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer Login | Savans Technologies" },
      { name: "description", content: "Login to view your Savans Technologies payment history." },
    ],
  }),
  component: CustomerLoginPage,
});

function CustomerLoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setError("");
    setRegisteredEmail("");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const result = await registerCustomerUser({
          data: { name: name.trim(), email: email.trim(), password },
        });

        if (!result.ok) {
          setError("An account already exists for this email.");
          return;
        }

        setRegisteredEmail(email.trim());
        return;
      }

      const result = await loginUser({
        data: { role: "customer", email: email.trim(), password },
      });

      if (!result.ok) {
        if ("reason" in result && result.reason === "unverified") {
          setError("Verify your email before logging in.");
        } else {
          setError("Invalid email or password.");
        }
        return;
      }

      setSessionToken(result.token);
      window.location.assign("/account");
    } catch (loginError) {
      console.error(loginError);
      setError("Login could not be completed.");
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
          {registeredEmail ? (
            <div className="text-center">
              <div className="mx-auto size-12 rounded-xl gradient-brand grid place-items-center text-background">
                <Mail className="size-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Check your email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a verification link to {registeredEmail}. Verify it, then log in.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  {mode === "register" ? (
                    <UserRoundPlus className="size-5" />
                  ) : (
                    <LogIn className="size-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold">Customer Login</h1>
                  <p className="text-xs text-muted-foreground">
                    View your payments and project updates.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => chooseMode("login")}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${mode === "login" ? "gradient-brand text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <LogIn className="size-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => chooseMode("register")}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${mode === "register" ? "gradient-brand text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <UserRoundPlus className="size-4" />
                  Register
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                {mode === "register" && (
                  <div>
                    <label className={labelClass} htmlFor="customer-name">
                      Full name
                    </label>
                    <input
                      id="customer-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={inputClass}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className={labelClass} htmlFor="customer-email">
                    Email
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="customer-password">
                    Password
                  </label>
                  <input
                    id="customer-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClass}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                  />
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}
                {mode === "login" && (
                  <a
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Forgot password?
                  </a>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full gradient-brand text-background font-medium px-5 py-2.5 text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

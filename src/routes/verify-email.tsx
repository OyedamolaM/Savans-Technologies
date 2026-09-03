import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, MailCheck } from "lucide-react";

import { verifyCustomerEmail } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{ title: "Verify Email | Savans Technologies" }],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "verified" | "invalid">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";

    void verifyCustomerEmail({ data: { token } })
      .then((result) => setStatus(result.ok ? "verified" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto size-12 rounded-xl gradient-brand grid place-items-center text-background">
          {status === "verified" ? (
            <CheckCircle2 className="size-6" />
          ) : (
            <MailCheck className="size-6" />
          )}
        </div>
        <h1 className="mt-4 text-xl font-bold">
          {status === "loading"
            ? "Verifying..."
            : status === "verified"
              ? "Email verified"
              : "Verification failed"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {status === "verified"
            ? "You can now log in to your customer account."
            : "This link may be invalid or already used."}
        </p>
        {status === "verified" && (
          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-full gradient-brand text-background font-medium px-6 py-3 text-sm"
          >
            Go to login
          </a>
        )}
      </div>
    </div>
  );
}

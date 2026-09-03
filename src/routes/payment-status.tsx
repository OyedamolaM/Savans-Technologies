import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { z } from "zod";

import { verifyPaymentStatus } from "@/lib/api/payment-status.functions";

const searchSchema = z.object({ reference: z.string().trim().min(1).max(120) });

export const Route = createFileRoute("/payment-status")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Payment status | Savans Technologies" }] }),
  component: PaymentStatusPage,
});

function PaymentStatusPage() {
  const { reference } = Route.useSearch();
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "abandoned" | "reversed" | "pending" | "error"
  >("loading");

  useEffect(() => {
    window.sessionStorage.removeItem("savans-pending-payment-reference");
    void verifyPaymentStatus({ data: { reference } })
      .then((result) => setStatus(result.status))
      .catch(() => setStatus("error"));
  }, [reference]);

  const content = {
    loading: { icon: Clock3, title: "Checking your payment", body: "Please wait a moment." },
    success: {
      icon: CheckCircle2,
      title: "Payment confirmed",
      body: "Thank you. We have received your payment and will contact you shortly.",
    },
    pending: {
      icon: Clock3,
      title: "Payment pending",
      body: "Your payment is still being confirmed. Please do not pay again yet.",
    },
    failed: {
      icon: XCircle,
      title: "Payment was not completed",
      body: "No payment was received. You can return and try again.",
    },
    abandoned: {
      icon: XCircle,
      title: "Payment was cancelled",
      body: "No payment was received. You can return and try again when ready.",
    },
    reversed: {
      icon: XCircle,
      title: "Payment was reversed",
      body: "The payment was not completed. You can return and try again when ready.",
    },
    error: {
      icon: XCircle,
      title: "We could not confirm the payment yet",
      body: "If you completed payment, contact us with your payment reference.",
    },
  }[status];
  const Icon = content.icon;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-sm">
        <Icon className="mx-auto size-10 text-foreground" />
        <h1 className="mt-4 text-2xl font-bold">{content.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.body}</p>
        <p className="mt-5 break-all text-xs text-muted-foreground">Reference: {reference}</p>
        <a
          href="/#pricing"
          className="mt-6 inline-flex rounded-full gradient-brand px-5 py-2.5 text-sm font-medium text-background"
        >
          Back to pricing
        </a>
      </section>
    </main>
  );
}

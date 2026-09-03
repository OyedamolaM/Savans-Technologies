import { createFileRoute } from "@tanstack/react-router";

import { verifyPaystackWebhookSignature } from "../../../lib/paystack.server";
import { sendPaymentNotificationEmails } from "../../../lib/email.server";
import { recordPaystackChargeSuccess } from "../../../lib/payment-store.server";

export const Route = createFileRoute("/api/paystack/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("x-paystack-signature");

        if (!verifyPaystackWebhookSignature(rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: { event?: unknown; data?: Record<string, unknown> } = {};

        try {
          event = JSON.parse(rawBody) as typeof event;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (event.event === "charge.success" && event.data?.status === "success") {
          const { payment, isNew } = await recordPaystackChargeSuccess(event);

          if (isNew) {
            try {
              await sendPaymentNotificationEmails(payment);
            } catch (error) {
              // The payment was recorded successfully. A non-2xx response would cause Paystack
              // to retry the webhook and could generate duplicate messages.
              console.error("Payment notification email failed", error);
            }
          }
        }

        return new Response(JSON.stringify({ status: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

const PaystackPaymentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  amount: z.coerce.number().positive().max(100_000_000),
  plan: z.string().trim().max(120).default("Project deposit"),
  note: z.string().trim().max(240).optional().default(""),
});

export const initializePaystackPayment = createServerFn({ method: "POST" })
  .inputValidator(PaystackPaymentSchema)
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const { initializePaystackTransaction } = await import("../paystack.server");

    const reference = `SAV-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const amountKobo = Math.round(data.amount * 100);
    const callbackUrl = `${config.siteUrl ?? "https://savanstech.com"}/contact?payment=returned&reference=${encodeURIComponent(reference)}`;

    const transaction = await initializePaystackTransaction({
      email: data.email,
      name: data.name,
      amountKobo,
      reference,
      callbackUrl,
      metadata: {
        source: "savans_website",
        payment_type: "project_deposit",
        plan: data.plan,
        note: data.note || undefined,
        custom_fields: [
          { display_name: "Name", variable_name: "name", value: data.name },
          { display_name: "Plan", variable_name: "plan", value: data.plan },
        ],
      },
    });

    return {
      authorizationUrl: transaction.authorization_url,
      accessCode: transaction.access_code,
      reference: transaction.reference,
    };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";
import { NIGERIA_VAT_RATE, PRICE_NAIRA_PER_USD } from "../currency";

const PaystackPaymentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  currency: z.enum(["NGN", "USD"]),
  plan: z.enum(["Starter", "Business", "E-commerce", "Professional"]),
  paymentOption: z.enum(["full", "deposit"]),
  note: z.string().trim().max(240).optional().default(""),
});

const PLAN_PRICES = {
  Starter: { ngn: 150_000, usd: 150 },
  Business: { ngn: 250_000, usd: 250 },
  "E-commerce": { ngn: 500_000, usd: 500 },
  Professional: { ngn: 1_200_000, usd: 1_200 },
} as const;

export const initializePaystackPayment = createServerFn({ method: "POST" })
  .inputValidator(PaystackPaymentSchema)
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const { initializePaystackTransaction } = await import("../paystack.server");

    const reference = `SAV-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const planPrice = PLAN_PRICES[data.plan];
    const displayedPrice = data.currency === "NGN" ? planPrice.ngn : planPrice.usd;
    const displayedSubtotal =
      data.paymentOption === "deposit" ? displayedPrice / 2 : displayedPrice;
    const chargeSubtotalNaira =
      data.currency === "NGN" ? displayedSubtotal : displayedSubtotal * PRICE_NAIRA_PER_USD;
    const vatAmount = data.currency === "NGN" ? chargeSubtotalNaira * NIGERIA_VAT_RATE : 0;
    const totalAmountNaira = Math.round((chargeSubtotalNaira + vatAmount) * 100) / 100;
    const amountSubunit = Math.round(totalAmountNaira * 100);
    const callbackUrl = `${config.siteUrl ?? "https://savanstech.com"}/contact?payment=returned&reference=${encodeURIComponent(reference)}`;

    const transaction = await initializePaystackTransaction({
      email: data.email,
      name: data.name,
      amountSubunit,
      currency: "NGN",
      channels: data.currency === "USD" ? ["card"] : undefined,
      reference,
      callbackUrl,
      metadata: {
        source: "savans_website",
        payment_type: data.paymentOption === "deposit" ? "project_deposit" : "project_full_payment",
        charge_currency: "NGN",
        display_currency: data.currency,
        subtotal: chargeSubtotalNaira,
        displayed_subtotal: displayedSubtotal,
        vat_rate: data.currency === "NGN" ? 7.5 : 0,
        vat_amount: vatAmount,
        total_amount: totalAmountNaira,
        usd_to_ngn_rate: data.currency === "USD" ? PRICE_NAIRA_PER_USD : undefined,
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

import crypto from "node:crypto";

import { getServerConfig } from "./config.server";

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackInitializePayload = {
  name: string;
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
};

export async function initializePaystackTransaction(payload: PaystackInitializePayload) {
  const config = getServerConfig();

  if (!config.paystackSecretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.paystackSecretKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      name: payload.name,
      amount: payload.amountKobo,
      currency: "NGN",
      reference: payload.reference,
      callback_url: payload.callbackUrl,
      metadata: payload.metadata,
    }),
  });

  const json = (await response.json()) as Partial<PaystackInitializeResponse>;

  if (!response.ok || !json.status || !json.data?.authorization_url) {
    console.error("Paystack initialize failed", {
      status: response.status,
      message: json.message,
    });
    throw new Error(json.message ?? "Paystack transaction could not be initialized");
  }

  return json.data;
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null) {
  const config = getServerConfig();

  if (!config.paystackSecretKey || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha512", config.paystackSecretKey)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

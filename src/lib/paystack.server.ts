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

type PaystackVerificationResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | "processing" | "reversed";
    gateway_response?: string | null;
  };
};

type PaystackInitializePayload = {
  name: string;
  email: string;
  amountSubunit: number;
  currency: "NGN" | "USD";
  channels?: ["card"];
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
      amount: payload.amountSubunit,
      currency: payload.currency,
      channels: payload.channels,
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

export async function verifyPaystackTransaction(reference: string) {
  const config = getServerConfig();

  if (!config.paystackSecretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { authorization: `Bearer ${config.paystackSecretKey}` } },
  );
  const json = (await response.json()) as Partial<PaystackVerificationResponse>;

  if (!response.ok || !json.status || !json.data?.status) {
    throw new Error(json.message ?? "Paystack transaction could not be verified");
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

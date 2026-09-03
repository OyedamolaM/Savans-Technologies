import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { updatePaymentAttemptStatus } from "../payment-store.server";
import { verifyPaystackTransaction } from "../paystack.server";

const VerifyPaymentSchema = z.object({ reference: z.string().trim().min(1).max(120) });

export const verifyPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator(VerifyPaymentSchema)
  .handler(async ({ data }) => {
    const transaction = await verifyPaystackTransaction(data.reference);
    const status =
      transaction.status === "ongoing" || transaction.status === "processing"
        ? "pending"
        : transaction.status;

    await updatePaymentAttemptStatus(
      data.reference,
      status,
      transaction.gateway_response ?? undefined,
    );
    return { status };
  });

export const markPaymentAttemptAbandoned = createServerFn({ method: "POST" })
  .inputValidator(VerifyPaymentSchema)
  .handler(async ({ data }) => {
    await updatePaymentAttemptStatus(data.reference, "abandoned");
    return { ok: true };
  });

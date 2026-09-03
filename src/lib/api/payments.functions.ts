import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";
import { getSession } from "../auth-store.server";
import {
  listPaymentAttempts,
  listStoredPayments,
  listStoredPaymentsForEmail,
} from "../payment-store.server";

export const listPaymentHistory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.adminToken || data.token !== config.adminToken) {
      return { authed: false };
    }

    return {
      authed: true,
      payments: await listStoredPayments(),
    };
  });

export const getAdminPaymentHistory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    const session = await getSession(data.token);

    if (!session || session.role !== "admin") {
      return { authed: false as const };
    }

    return {
      authed: true as const,
      payments: await listStoredPayments(),
      attempts: await listPaymentAttempts(),
    };
  });

export const getCustomerAccount = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    const session = await getSession(data.token);

    if (!session || session.role !== "customer") {
      return { authed: false as const };
    }

    return {
      authed: true as const,
      email: session.email,
      payments: await listStoredPaymentsForEmail(session.email),
    };
  });

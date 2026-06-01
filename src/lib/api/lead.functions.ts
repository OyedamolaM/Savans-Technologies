import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  service: z.string().trim().min(1).max(100),
  budget: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(1000),
  source: z.string().trim().max(100).default("contact_form"),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(LeadSchema)
  .handler(async ({ data }) => {
    const config = getServerConfig();

    if (!config.leadWebhookUrl) {
      return { forwarded: false };
    }

    const response = await fetch(config.leadWebhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(config.leadWebhookToken ? { authorization: `Bearer ${config.leadWebhookToken}` } : {}),
      },
      body: JSON.stringify({
        ...data,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Lead webhook failed with status ${response.status}`);
    }

    return { forwarded: true };
  });

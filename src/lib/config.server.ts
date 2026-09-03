import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    siteUrl: process.env.SITE_URL ?? "https://savanstech.com",
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    leadWebhookUrl: process.env.LEAD_WEBHOOK_URL,
    leadWebhookToken: process.env.LEAD_WEBHOOK_TOKEN,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    adminToken: process.env.ADMIN_TOKEN,
    adminEmail: process.env.ADMIN_EMAIL ?? "admin@savanstech.com",
    adminPassword: process.env.ADMIN_PASSWORD,
    notificationEmailTo: process.env.NOTIFICATION_EMAIL_TO ?? "oyedamola@savanstech.com",
    emailFrom: process.env.EMAIL_FROM ?? "Savans Technologies <hello@savanstech.com>",
    emailTransport: {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      smtpSecure: process.env.SMTP_SECURE === "true",
      brevoApiKey: process.env.BREVO_API_KEY,
      resendApiKey: process.env.RESEND_API_KEY,
    },
    // Add server-only values here, e.g.:
    //   databaseUrl: process.env.DATABASE_URL,
    //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
}

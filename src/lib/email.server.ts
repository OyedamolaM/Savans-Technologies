import nodemailer from "nodemailer";

import { getServerConfig } from "./config.server";
import type { StoredPayment } from "./payment-store.server";

function formatPaymentAmount(payment: StoredPayment) {
  return new Intl.NumberFormat(payment.currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency: payment.currency,
    minimumFractionDigits: 2,
  }).format(payment.amountNaira);
}

type EmailAddresses = {
  owner: string;
  customer?: string;
};

export async function sendPaymentNotificationEmails(payment: StoredPayment) {
  const config = getServerConfig();

  if (
    !config.emailTransport.smtpHost &&
    !config.emailTransport.brevoApiKey &&
    !config.emailTransport.resendApiKey
  ) {
    console.warn("Email notifications are not configured. Set SMTP_* or BREVO_API_KEY.");
    return { sent: false, reason: "email_transport_not_configured" };
  }

  const recipients: EmailAddresses = {
    owner: config.notificationEmailTo,
    customer: payment.customerEmail,
  };

  const ownerSubject = `New Paystack payment - ${payment.customerEmail ?? "customer"}`;
  const customerSubject = "Payment received - Savans Technologies";

  if (config.emailTransport.smtpHost) {
    const transporter = nodemailer.createTransport({
      host: config.emailTransport.smtpHost,
      port: config.emailTransport.smtpPort ?? 587,
      secure: config.emailTransport.smtpSecure,
      auth: config.emailTransport.smtpUser
        ? {
            user: config.emailTransport.smtpUser,
            pass: config.emailTransport.smtpPass,
          }
        : undefined,
    });

    const results = await Promise.allSettled([
      transporter.sendMail({
        from: config.emailFrom,
        to: recipients.owner,
        subject: ownerSubject,
        text: buildOwnerText(payment),
        html: buildOwnerHtml(payment),
      }),
      ...(recipients.customer
        ? [
            transporter.sendMail({
              from: config.emailFrom,
              to: recipients.customer,
              subject: customerSubject,
              text: buildCustomerText(payment),
              html: buildCustomerHtml(payment),
            }),
          ]
        : []),
    ]);

    return {
      sent: results.some((result) => result.status === "fulfilled"),
      results: results.map((result) => result.status),
    };
  }

  if (config.emailTransport.brevoApiKey) {
    return sendWithBrevo(config.emailTransport.brevoApiKey, config.emailFrom, [
      {
        to: recipients.owner,
        subject: ownerSubject,
        text: buildOwnerText(payment),
        html: buildOwnerHtml(payment),
      },
      ...(recipients.customer
        ? [
            {
              to: recipients.customer,
              subject: customerSubject,
              text: buildCustomerText(payment),
              html: buildCustomerHtml(payment),
            },
          ]
        : []),
    ]);
  }

  if (config.emailTransport.resendApiKey) {
    return sendWithResend(config.emailTransport.resendApiKey, config.emailFrom, [
      {
        to: recipients.owner,
        subject: ownerSubject,
        text: buildOwnerText(payment),
        html: buildOwnerHtml(payment),
      },
      ...(recipients.customer
        ? [
            {
              to: recipients.customer,
              subject: customerSubject,
              text: buildCustomerText(payment),
              html: buildCustomerHtml(payment),
            },
          ]
        : []),
    ]);
  }

  return { sent: false, reason: "email_transport_not_configured" };
}

async function sendWithBrevo(
  apiKey: string,
  from: string,
  emails: Array<{ to: string; subject: string; text: string; html: string }>,
) {
  const sender = parseEmailSender(from);
  const results = await Promise.allSettled(
    emails.map((email) =>
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender,
          to: [{ email: email.to }],
          subject: email.subject,
          textContent: email.text,
          htmlContent: email.html,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          throw new Error(`Brevo request failed with status ${response.status}: ${detail}`);
        }
        return response.json();
      }),
    ),
  );

  return {
    sent: results.some((result) => result.status === "fulfilled"),
    results: results.map((result) => result.status),
    errors: results
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => String(result.reason)),
  };
}

async function sendWithResend(
  apiKey: string,
  from: string,
  emails: Array<{ to: string; subject: string; text: string; html: string }>,
) {
  const results = await Promise.allSettled(
    emails.map((email) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ from, ...email }),
      }).then((response) => {
        if (!response.ok) throw new Error(`Resend request failed with status ${response.status}`);
        return response.json();
      }),
    ),
  );

  return {
    sent: results.some((result) => result.status === "fulfilled"),
    results: results.map((result) => result.status),
  };
}

export async function sendVerificationEmail(to: string, token: string) {
  const config = getServerConfig();
  const url = `${config.siteUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = "Verify your email - Savans Technologies";

  return sendSingleEmail({
    to,
    subject,
    text: `Verify your email\n\nOpen this link to verify your email:\n${url}`,
    html: `<h2>Verify your email</h2><p>Open the link below to verify your email:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const config = getServerConfig();
  const url = `${config.siteUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = "Reset your password - Savans Technologies";

  return sendSingleEmail({
    to,
    subject,
    text: `Reset your password\n\nOpen this link to reset your password:\n${url}`,
    html: `<h2>Reset your password</h2><p>Open the link below to choose a new password:</p><p><a href="${url}">${url}</a></p>`,
  });
}

async function sendSingleEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const config = getServerConfig();

  if (
    !config.emailTransport.smtpHost &&
    !config.emailTransport.brevoApiKey &&
    !config.emailTransport.resendApiKey
  ) {
    return { sent: false, reason: "email_transport_not_configured" };
  }

  if (config.emailTransport.smtpHost) {
    const transporter = nodemailer.createTransport({
      host: config.emailTransport.smtpHost,
      port: config.emailTransport.smtpPort ?? 587,
      secure: config.emailTransport.smtpSecure,
      auth: config.emailTransport.smtpUser
        ? {
            user: config.emailTransport.smtpUser,
            pass: config.emailTransport.smtpPass,
          }
        : undefined,
    });

    await transporter.sendMail({ from: config.emailFrom, to, subject, text, html });
    return { sent: true };
  }

  if (config.emailTransport.brevoApiKey) {
    const result = await sendWithBrevo(config.emailTransport.brevoApiKey, config.emailFrom, [
      { to, subject, text, html },
    ]);
    return { sent: result.sent, reason: result.errors?.join("; ") };
  }

  if (config.emailTransport.resendApiKey) {
    const result = await sendWithResend(config.emailTransport.resendApiKey, config.emailFrom, [
      { to, subject, text, html },
    ]);
    return { sent: result.sent };
  }

  return { sent: false, reason: "email_transport_not_configured" };
}

function buildOwnerText(payment: StoredPayment) {
  return `New Paystack payment

Customer: ${payment.customerName ?? "Not provided"} (${payment.customerEmail ?? "No email"})
Plan: ${payment.plan ?? "Not provided"}
Amount: ${formatPaymentAmount(payment)}
Reference: ${payment.reference}
Paid at: ${payment.paidAt}
`;
}

function buildOwnerHtml(payment: StoredPayment) {
  return `
<h2>New Paystack payment</h2>
<p><strong>Customer:</strong> ${escapeHtml(payment.customerName ?? "Not provided")} (${escapeHtml(payment.customerEmail ?? "No email")})</p>
<p><strong>Plan:</strong> ${escapeHtml(payment.plan ?? "Not provided")}</p>
<p><strong>Amount:</strong> ${formatPaymentAmount(payment)}</p>
<p><strong>Reference:</strong> ${escapeHtml(payment.reference)}</p>
<p><strong>Paid at:</strong> ${escapeHtml(payment.paidAt)}</p>
`;
}

function buildCustomerText(payment: StoredPayment) {
  return `Hi ${payment.customerName ?? "there"},

Thanks for your payment of ${formatPaymentAmount(payment)}.
Reference: ${payment.reference}

We will be in touch soon about your project.
`;
}

function buildCustomerHtml(payment: StoredPayment) {
  return `
<h2>Payment received</h2>
<p>Hi ${escapeHtml(payment.customerName ?? "there")},</p>
<p>Thanks for your payment of ${formatPaymentAmount(payment)}.</p>
<p>Reference: ${escapeHtml(payment.reference)}</p>
<p>We will be in touch soon about your project.</p>
`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character] ?? character;
  });
}

function parseEmailSender(value: string) {
  const match = value.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2],
    };
  }

  return { name: "", email: value };
}

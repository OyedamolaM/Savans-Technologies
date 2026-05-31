import { useState } from "react";
import { z } from "zod";
import { Check } from "lucide-react";
import { CONTACT } from "@/lib/site-data";
import { trackEvent } from "@/lib/analytics";
import { submitLead } from "@/lib/api/lead.functions";

const Schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  service: z.string().min(1, "Select a service").max(100),
  budget: z.string().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const SERVICES = [
  "Website Development",
  "E-Commerce Development",
  "Custom Web Application",
  "Inventory Management",
  "Business Automations",
  "Website Maintenance",
  "Something else",
];

const BUDGETS = ["Under NGN500k", "NGN500k - NGN1.5M", "NGN1.5M - NGN5M", "NGN5M+"];

function getValidationErrors(data: Record<string, FormDataEntryValue>) {
  const parsed = Schema.safeParse(data);
  if (parsed.success) return {};

  const errs: Record<string, string> = {};
  parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
  return errs;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    if (Object.keys(errors).length === 0) return;

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setErrors(getValidationErrors(data));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = Schema.safeParse(data);

    if (!parsed.success) {
      setErrors(getValidationErrors(data));
      return;
    }

    setErrors({});
    trackEvent("contact_form_submit", {
      service: parsed.data.service,
      budget: parsed.data.budget || "Not sure yet",
    });

    const text = `Hi Savans! I'm ${parsed.data.name} (${parsed.data.email}).\nService: ${parsed.data.service}\nBudget: ${parsed.data.budget || "-"}\nProject details: ${parsed.data.message || "-"}`;
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);

    void submitLead({
      data: {
        ...parsed.data,
        budget: parsed.data.budget || undefined,
        source: "contact_form",
      },
    }).catch((error) => {
      console.error("Lead forwarding failed", error);
    });
  };

  if (sent) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <div className="mx-auto size-12 rounded-full gradient-brand grid place-items-center text-background mb-4">
          <Check className="size-6" />
        </div>
        <h3 className="text-xl font-display mb-2">Thanks - we'll be in touch.</h3>
        <p className="text-muted-foreground text-sm">
          We've opened WhatsApp for you. If it didn't open, email us at{" "}
          <a
            className="underline"
            href={`mailto:${CONTACT.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CONTACT.email}
          </a>
          .
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm underline text-muted-foreground"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl bg-card/60 border border-border px-4 py-3 text-sm outline-none focus:border-foreground/40 transition";
  const label = "text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block";

  return (
    <form
      onSubmit={onSubmit}
      onChange={onChange}
      className="glass-strong rounded-2xl p-6 sm:p-8 grid gap-4"
      noValidate
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={100}
            className={field}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={255}
            className={field}
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="service">
            Service
          </label>
          <select id="service" name="service" required className={field} defaultValue="">
            <option value="" disabled>
              Choose a service
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && <p className="text-xs text-destructive mt-1">{errors.service}</p>}
        </div>
        <div>
          <label className={label} htmlFor="budget">
            Budget (optional)
          </label>
          <select id="budget" name="budget" className={field} defaultValue="">
            <option value="">Not sure yet</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="message">
          Project details
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={1000}
          rows={5}
          className={field}
          placeholder="Optional: tell us about your project, goals, and timeline."
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex justify-center items-center rounded-full gradient-brand text-background font-medium px-6 py-3 hover:opacity-90 transition"
      >
        Send message via WhatsApp
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Or email{" "}
        <a
          className="underline"
          href={`mailto:${CONTACT.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONTACT.email}
        </a>{" "}
        - Call{" "}
        <a
          className="underline"
          href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONTACT.phone}
        </a>
      </p>
    </form>
  );
}

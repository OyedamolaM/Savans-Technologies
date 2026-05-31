import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Savans Technologies" },
      {
        name: "description",
        content:
          "Privacy policy for Savans Technologies, covering how we collect, use, and protect contact and project information.",
      },
    ],
    links: [{ rel: "canonical", href: `${CONTACT.domain}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gradient font-semibold">
            Legal
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
            <p className="mt-3">
              When you contact Savans Technologies, request a quote, or submit a project
              inquiry, we may collect your name, email address, phone number, business details,
              project requirements, and any files or messages you choose to send us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">How We Use Information</h2>
            <p className="mt-3">
              We use your information to respond to inquiries, prepare proposals, deliver
              services, provide support, improve our website, and communicate about active or
              potential projects. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Project And Client Data</h2>
            <p className="mt-3">
              Any credentials, business records, customer data, or project materials shared with
              us are treated as confidential and used only for the work you authorize. You remain
              responsible for ensuring you have the right to share any third-party data with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Cookies And Analytics</h2>
            <p className="mt-3">
              Our website may use basic analytics, performance tools, or cookies to understand
              site usage and improve the browsing experience. You can control cookies through
              your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Data Security</h2>
            <p className="mt-3">
              We use reasonable technical and organizational measures to protect information.
              No online transmission or storage method is completely secure, but we work to keep
              your data protected and limit access to people who need it for service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
            <p className="mt-3">
              You may request access, correction, or deletion of your personal information by
              contacting us. We may keep certain records where required for legal, tax, security,
              or legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p className="mt-3">
              For privacy questions, email{" "}
              <a className="text-foreground underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

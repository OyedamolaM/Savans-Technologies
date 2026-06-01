import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Savans Technologies" },
      {
        name: "description",
        content:
          "Terms of service for Savans Technologies website, project inquiries, proposals, development services, and support.",
      },
    ],
    links: [{ rel: "canonical", href: `${CONTACT.domain}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
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
          <p className="text-xs uppercase tracking-[0.2em] text-gradient font-semibold">Legal</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: May 31, 2026</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Use Of This Website</h2>
            <p className="mt-3">
              By using this website or contacting Savans Technologies, you agree to use our site
              lawfully and not attempt to disrupt, misuse, copy, or interfere with its operation or
              content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Project Inquiries</h2>
            <p className="mt-3">
              Information on this website is provided for general guidance. A project inquiry,
              consultation, or message does not create a binding agreement until both parties accept
              a written proposal, contract, invoice, or statement of work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Pricing And Payments</h2>
            <p className="mt-3">
              Prices shown on the website are starting estimates and may change based on scope,
              timeline, integrations, content, support needs, and technical complexity. Payment
              terms, milestones, and deliverables will be confirmed in writing before work begins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Client Responsibilities</h2>
            <p className="mt-3">
              Clients are responsible for providing accurate project information, content,
              approvals, brand assets, access credentials, and feedback on time. Delays in these
              items may affect delivery timelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
            <p className="mt-3">
              Unless otherwise agreed in writing, final custom deliverables are transferred to the
              client after full payment. Savans Technologies may retain rights to reusable tools,
              frameworks, code patterns, internal processes, and non-client-specific materials used
              to deliver the work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p className="mt-3">
              Projects may depend on hosting providers, payment gateways, analytics tools, domains,
              plugins, APIs, or other third-party services. Their availability, pricing, and
              policies are controlled by those providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Limitation Of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, Savans Technologies is not liable for
              indirect, incidental, or consequential losses arising from use of this website or
              services, including lost revenue, data loss, or business interruption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p className="mt-3">
              For questions about these terms, email{" "}
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

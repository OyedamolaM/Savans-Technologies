import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  Check,
  ClipboardList,
  CreditCard,
  Mail,
  MessageCircle,
  PackageCheck,
  Pill,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Store,
  Truck,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/FadeIn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { trackEvent } from "@/lib/analytics";
import { CONTACT, NAV_LINKS, SERVICES, SOCIAL_LINKS } from "@/lib/site-data";

const SITE_URL = `${CONTACT.domain}/pharmacy`;
const DEFAULT_MESSAGE = "Hi Savans Technologies. I want a digital solution for my pharmacy.";

const outcomes = [
  {
    stat: "Refills",
    title: "Bring customers back before they run out",
    desc: "Automated reminders help patients reorder on time instead of waiting until they remember.",
  },
  {
    stat: "Orders",
    title: "Sell beyond your physical counter",
    desc: "Let customers browse products, upload prescriptions, and request delivery from anywhere.",
  },
  {
    stat: "Retention",
    title: "Own the customer relationship",
    desc: "Use email, SMS, and WhatsApp touchpoints to stay connected after the first purchase.",
  },
];

const solutions = [
  {
    icon: ShoppingCart,
    title: "Pharmacy e-commerce websites",
    desc: "Product catalogs, prescription uploads, order requests, checkout, delivery options, and payment gateway integration.",
  },
  {
    icon: BellRing,
    title: "Refill and reminder systems",
    desc: "Automated refill prompts for chronic medications, follow-up messages, and repeat purchase workflows.",
  },
  {
    icon: Mail,
    title: "Email and SMS marketing",
    desc: "Campaigns for promotions, health awareness, abandoned carts, new stock alerts, and patient engagement.",
  },
  {
    icon: Smartphone,
    title: "Customer mobile apps",
    desc: "Mobile experiences that keep your pharmacy, products, refills, and updates close to your customers.",
  },
  {
    icon: Stethoscope,
    title: "Telemedicine solutions",
    desc: "Remote consultation flows, patient intake, practitioner scheduling, and secure digital communication.",
  },
  {
    icon: PackageCheck,
    title: "Inventory management systems",
    desc: "Track stock, manage locations, monitor expiry dates, reduce stockouts, and make reorder decisions faster.",
  },
  {
    icon: BarChart3,
    title: "Financial records and reports",
    desc: "Dashboards for sales, expenses, product performance, customer behavior, and operational decisions.",
  },
  {
    icon: CreditCard,
    title: "Payment gateway integration",
    desc: "Accept online payments, confirm transactions, and simplify how customers complete orders.",
  },
  {
    icon: ClipboardList,
    title: "Custom web and mobile apps",
    desc: "Purpose-built tools for wholesalers, distributors, pharmacy chains, clinical teams, and internal operations.",
  },
];

const buyerTypes = [
  {
    icon: Store,
    title: "Single-store pharmacies",
    desc: "Start with an online storefront, refill requests, and customer follow-up workflows.",
  },
  {
    icon: Users,
    title: "Growing pharmacy chains",
    desc: "Centralize ordering, branches, staff workflows, stock visibility, and customer engagement.",
  },
  {
    icon: Truck,
    title: "Wholesalers and distributors",
    desc: "Build B2B ordering portals, inventory visibility, customer accounts, and payment flows.",
  },
];

const process = [
  {
    step: "01",
    title: "Map your pharmacy workflow",
    desc: "We review your current sales, refills, stock, customer communication, and growth goals.",
  },
  {
    step: "02",
    title: "Choose the right digital system",
    desc: "We recommend the fastest path: e-commerce, refills, inventory, marketing automation, or a custom platform.",
  },
  {
    step: "03",
    title: "Build, connect, and launch",
    desc: "We design the customer experience, integrate payments and workflows, then prepare the system for launch.",
  },
  {
    step: "04",
    title: "Measure and improve retention",
    desc: "After launch, we help you track what customers buy, what they reorder, and where sales can improve.",
  },
];

const faqs = [
  {
    q: "Can this work for a small pharmacy?",
    a: "Yes. A single-store pharmacy can start with a focused website, refill form, WhatsApp ordering flow, and customer reminders before adding advanced systems.",
  },
  {
    q: "Do you build pharmacy e-commerce websites?",
    a: "Yes. We build pharmacy product catalogs, ordering flows, prescription upload forms, checkout, payment integration, and admin tools.",
  },
  {
    q: "Can you help with repeat purchases?",
    a: "Yes. Refill reminders, automated follow-up messages, customer lists, email campaigns, and SMS workflows are designed to bring customers back.",
  },
  {
    q: "Can you build custom pharmacy software?",
    a: "Yes. We build custom web and mobile applications for pharmacies, pharmacy chains, wholesalers, distributors, and healthcare teams.",
  },
];

function whatsappHref(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const Route = createFileRoute("/pharmacy")({
  head: () => ({
    meta: [
      { title: "Digital Solutions for Pharmacies | Savans Technologies" },
      {
        name: "description",
        content:
          "Pharmacy e-commerce websites, refill reminders, SMS marketing, inventory systems, payment integration, and custom apps built by pharmacists at Savans Technologies.",
      },
      {
        name: "keywords",
        content:
          "pharmacy website, pharmacy ecommerce, prescription refill reminders, pharmacy inventory software, pharmacy digital marketing, pharmacy app Nigeria",
      },
      { property: "og:title", content: "Digital Solutions for Pharmacies" },
      {
        property: "og:description",
        content:
          "Increase pharmacy sales, improve customer retention, and simplify operations with pharmacist-led digital systems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${CONTACT.domain}/projects/SavansPharmacy.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Digital Solutions for Pharmacies" },
      {
        name: "twitter:description",
        content:
          "Pharmacy e-commerce, refill reminders, automation, inventory, reports, and custom apps by Savans Technologies.",
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: "Digital Solutions for Pharmacies",
              provider: {
                "@type": "Organization",
                name: "Savans Technologies",
                url: CONTACT.domain,
              },
              serviceType: "Pharmacy e-commerce and digital operations systems",
              areaServed: "NG",
              url: SITE_URL,
              description:
                "Pharmacy e-commerce websites, prescription refill systems, marketing automation, inventory systems, reporting tools, payment integration, telemedicine solutions, and custom applications.",
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: PharmacyLandingPage,
});

function PharmacyLandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <PharmacyHeader />
      <Hero />
      <Opportunity />
      <Solutions />
      <Proof />
      <Audience />
      <Process />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

function PharmacyHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-[24rem] items-center gap-3 px-4 sm:max-w-7xl sm:px-6">
        <div className="glass-strong flex w-full items-center gap-3 rounded-full px-3 py-2.5 sm:px-5">
          <a href="/" className="flex shrink-0 items-center" aria-label="Savans Technologies home">
            <img
              src="/savans-logo.svg"
              alt="Savans Technologies"
              className="h-9 w-32 rounded-md object-contain sm:h-12 sm:w-44"
            />
          </a>

          <nav className="ml-4 hidden items-center gap-1 text-sm lg:flex">
            <a
              href="#solutions"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              Solutions
            </a>
            <a
              href="#proof"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              Proof
            </a>
            <a
              href="#process"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              Process
            </a>
            <a
              href="#faq"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              FAQ
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("pharmacy_whatsapp_click", { location: "header" })}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden sm:min-h-[78svh]">
      <img
        src="/projects/SavansPharmacy.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top opacity-55"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,23,0.96)_0%,rgba(7,8,23,0.82)_48%,rgba(7,8,23,0.45)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,23,0.36)_0%,rgba(7,8,23,0)_42%,var(--background)_100%)]" />

      <div className="relative mx-auto flex max-w-[24rem] px-4 pb-16 pt-32 sm:max-w-7xl sm:px-6 sm:pb-20 sm:pt-40">
        <div className="max-w-[22rem] sm:max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#B9F6D2] backdrop-blur">
            <Pill className="size-3.5" />
            Pharmacist-led digital systems
          </p>
          <h1 className="mt-6 max-w-[22rem] text-3xl font-extrabold leading-[1.08] tracking-normal text-white sm:max-w-none sm:text-6xl lg:text-7xl">
            Pharmacy Digital Growth Systems
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Help customers find your pharmacy online, browse products, request refills, receive
            reminders, pay easily, and keep coming back without depending only on your physical
            store or social media pages.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref("Hi Savans Technologies. I want to digitize my pharmacy.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("pharmacy_whatsapp_click", { location: "hero_primary" })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              Discuss my pharmacy <MessageCircle className="size-5" />
            </a>
            <a
              href="#solutions"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/18 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:w-auto"
            >
              View solutions <ArrowRight className="size-5" />
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 border-t border-white/15 pt-6 text-sm text-white/72 sm:grid-cols-3">
            <div>
              <span className="block text-lg font-bold text-white">E-commerce</span>
              Online product ordering
            </div>
            <div>
              <span className="block text-lg font-bold text-white">Refills</span>
              Automated reminders
            </div>
            <div>
              <span className="block text-lg font-bold text-white">Operations</span>
              Stock and reports
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Opportunity() {
  return (
    <section className="border-y border-border bg-card/35 py-14 sm:py-18">
      <div className="mx-auto max-w-[24rem] px-4 sm:max-w-7xl sm:px-6">
        <div className="max-w-[22rem] sm:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
            The opportunity
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Your customers already expect a digital pharmacy experience.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Today, customers want to search online, request refills remotely, receive medication
            reminders, pay conveniently, and interact with your pharmacy without waiting until they
            walk through the door.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {outcomes.map((item, index) => (
            <FadeIn
              key={item.title}
              delay={index * 80}
              className="rounded-lg border border-border bg-background/60 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                {item.stat}
              </p>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section id="solutions" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[24rem] px-4 sm:max-w-7xl sm:px-6">
        <FadeIn className="mx-auto max-w-[22rem] text-center sm:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
            What we build
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Digital systems that increase sales and make pharmacy operations easier.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <FadeIn
                key={solution.title}
                delay={(index % 3) * 80}
                className="rounded-lg border border-border bg-card/50 p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-lg gradient-brand text-background">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{solution.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{solution.desc}</p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section id="proof" className="border-y border-border bg-card/35 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[24rem] gap-10 px-4 sm:max-w-7xl sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
            Built by pharmacists
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            We understand both pharmacy care and digital commerce.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Savans Technologies was built by pharmacists to help pharmacies increase sales, improve
            customer retention, and simplify operations through AI-powered and modern digital
            solutions.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Prescription-aware ordering flows",
              "Repeat purchase and refill journeys",
              "Inventory, payment, and reporting tools",
              "Custom systems for retail, chain, wholesale, and distribution operations",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/18 text-brand">
                  <Check className="size-3.5" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref(
                "Hi Savans Technologies. I want to see pharmacy solution options.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("pharmacy_whatsapp_click", { location: "proof" })}
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3 font-semibold text-background transition hover:opacity-90"
            >
              Talk to a pharmacist-builder <ArrowUpRight className="size-5" />
            </a>
            <a
              href="/#work"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-card"
            >
              View portfolio
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/20">
            <img
              src="/projects/Auradashboard.png"
              alt="Pharmacy operations dashboard by Savans Technologies"
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[24rem] px-4 sm:max-w-7xl sm:px-6">
        <FadeIn className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
            Who it serves
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Built for pharmacies at every stage of growth.
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {buyerTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <FadeIn
                key={type.title}
                delay={index * 80}
                className="rounded-lg border border-border bg-card/45 p-6"
              >
                <Icon className="size-8 text-brand" />
                <h3 className="mt-5 text-xl font-semibold">{type.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{type.desc}</p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="border-y border-border bg-card/35 py-16 sm:py-24">
      <div className="mx-auto max-w-[24rem] px-4 sm:max-w-7xl sm:px-6">
        <FadeIn className="mx-auto max-w-[22rem] text-center sm:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
            How we start
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            From current pharmacy workflow to launched digital system.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {process.map((item, index) => (
            <FadeIn
              key={item.step}
              delay={index * 80}
              className="rounded-lg border border-border bg-background/60 p-6"
            >
              <span className="text-sm font-bold text-brand">{item.step}</span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-[24rem] gap-10 px-4 sm:max-w-7xl sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Questions pharmacy owners ask first.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            The best starting point is a short conversation about how your pharmacy currently sells,
            follows up, and manages customer demand.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn
              key={faq.q}
              delay={index * 80}
              className="rounded-lg border border-border bg-card/50 p-6"
            >
              <h3 className="text-lg font-semibold">{faq.q}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.a}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-[24rem] overflow-hidden rounded-lg border border-border bg-card/55 sm:max-w-7xl">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gradient">
              Ready to sell online
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
              Give your customers a pharmacy they can access anytime.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              Let customers find you online, browse products, request refills, and connect with your
              business from wherever they are.
            </p>
          </div>

          <a
            href={whatsappHref(
              "Hi Savans Technologies. I want a landing page consultation for my pharmacy.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("pharmacy_whatsapp_click", { location: "final_cta" })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Message on WhatsApp <MessageCircle className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto max-w-[24rem] px-4 py-12 sm:max-w-7xl sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 text-sm sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <img
                src="/savans-logo.svg"
                alt="Savans Technologies logo"
                className="h-24 w-80 rounded-md object-contain"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Web engineering studio building websites, e-commerce, and SaaS for businesses.
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h4 className="mb-3 font-semibold">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a href="/#services" className="hover:text-foreground">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="mb-3 font-semibold">Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="mb-3 font-semibold">Contact</h4>
            <ul className="space-y-2 break-words text-sm text-muted-foreground">
              <li>{CONTACT.email}</li>
              <li>{CONTACT.phone}</li>
              <li>{CONTACT.location}</li>
              <li className="pt-2">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Savans Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Menu,
  X,
  Plus,
  Minus,
  Globe,
  ShoppingCart,
  Layers,
  Package,
  Settings,
  Wrench,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { ContactForm } from "@/components/ContactForm";
import { trackEvent } from "@/lib/analytics";
import {
  NAV_LINKS,
  SERVICES,
  PROJECTS,
  PRICING,
  PROCESS,
  FAQS,
  TESTIMONIALS,
  CONTACT,
  SOCIAL_LINKS,
} from "@/lib/site-data";

const ICONS = { Globe, ShoppingCart, Layers, Package, Settings, Wrench } as const;

const SITE_TITLE =
  "Savans Technologies | Web Development, E-commerce & SaaS Solutions for Nigerian Businesses";
const SITE_DESC =
  "Custom website development, e-commerce platforms, web apps, and inventory systems for businesses in Nigeria. Fast, affordable, results-driven.";
const SITE_URL = "https://savanstech.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      {
        name: "keywords",
        content:
          "web development Nigeria, e-commerce development Lagos, custom web applications, inventory management system, business automation",
      },
      { name: "author", content: "Savans Technologies" },
      {
        property: "og:title",
        content: "Savans Technologies — Digital Solutions for Nigerian Businesses",
      },
      {
        property: "og:description",
        content:
          "We build websites, e-commerce stores, web apps, and automation systems that help Nigerian businesses grow online.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "Savans Technologies" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Savans Technologies — Digital Solutions for Nigerian Businesses",
      },
      { name: "twitter:description", content: SITE_DESC },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Savans Technologies",
              url: SITE_URL,
              email: CONTACT.email,
              telephone: CONTACT.phone,
              address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
            },
            {
              "@type": "LocalBusiness",
              name: "Savans Technologies",
              url: SITE_URL,
              telephone: CONTACT.phone,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressRegion: "Lagos",
                addressCountry: "NG",
              },
              areaServed: "NG",
              priceRange: "₦₦",
            },
            ...SERVICES.map((s) => ({
              "@type": "Service",
              name: s.title,
              description: s.desc,
              provider: { "@type": "Organization", name: "Savans Technologies" },
              areaServed: "NG",
            })),
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "AggregateRating",
              itemReviewed: { "@type": "Organization", name: "Savans Technologies" },
              ratingValue: "5",
              reviewCount: String(TESTIMONIALS.length),
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <Hero />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function FloatingWhatsApp() {
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi Savans! I'd like to talk about a project.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Savans Technologies on WhatsApp"
      onClick={() => trackEvent("whatsapp_float_click", { location: "floating_button" })}
      className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_45px_rgba(37,211,102,0.35)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background sm:bottom-6 sm:right-6"
    >
      <svg
        className="size-8"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.04 3C8.86 3 3.02 8.84 3.02 16.02c0 2.32.62 4.58 1.8 6.56L3 29l6.6-1.74a12.9 12.9 0 0 0 6.44 1.72c7.18 0 13.02-5.84 13.02-13.02C29.06 8.82 23.22 3 16.04 3Zm0 23.64c-2.06 0-4.06-.56-5.82-1.62l-.42-.24-3.9 1.02 1.04-3.78-.28-.44a10.58 10.58 0 0 1-1.6-5.56c0-6.06 4.92-10.98 10.98-10.98s10.98 4.92 10.98 10.98-4.92 10.62-10.98 10.62Zm6.02-8.2c-.34-.16-1.98-.98-2.28-1.08-.3-.12-.52-.16-.74.16-.22.34-.86 1.08-1.06 1.3-.2.22-.38.24-.72.08-.34-.16-1.42-.52-2.7-1.66-1-.9-1.68-2-1.88-2.34-.2-.34-.02-.52.14-.68.16-.14.34-.38.5-.56.16-.2.22-.34.34-.56.12-.22.06-.42-.02-.58-.08-.16-.74-1.78-1.02-2.44-.26-.64-.54-.54-.74-.56h-.62c-.22 0-.58.08-.88.42-.3.34-1.16 1.14-1.16 2.76s1.18 3.2 1.34 3.42c.16.22 2.32 3.54 5.62 4.96.78.34 1.4.54 1.88.7.8.26 1.52.22 2.08.14.64-.1 1.98-.8 2.26-1.58.28-.78.28-1.44.2-1.58-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  );
}

/* =========================================== HEADER */
function Header() {
  const [open, setOpen] = useState(false);
  const wa = `https://wa.me/${CONTACT.whatsapp}`;
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <div className="glass-strong rounded-full px-2.5 sm:px-5 py-2.5 flex items-center gap-1 sm:gap-3">
          <a href="#" className="flex items-center font-display font-bold text-lg shrink-0">
            <img
              src="/savans-logo.svg"
              alt="Savans Technologies logo"
              className="h-11 w-36 sm:h-[52px] sm:w-48 rounded-md object-contain"
            />
          </a>
          <nav className="hidden lg:flex items-center gap-1 ml-4 text-sm">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("start_project_click", { location: "header" })}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full gradient-brand text-background text-sm font-medium px-4 py-2 hover:opacity-90 transition"
            >
              Get Started <ArrowUpRight className="size-3.5" />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden size-8 sm:size-9 rounded-full border border-border grid place-items-center"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 grid gap-1 text-sm">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href={wa}
              onClick={() => trackEvent("start_project_click", { location: "mobile_menu" })}
              className="px-3 py-2 rounded-lg text-center gradient-brand text-background font-medium mt-1"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================== HERO */
function Hero() {
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi Savans! I'd like to start a project.")}`;
  return (
    <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 hero-aurora pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-[hsl(140,70%,55%)] animate-pulse" />
            Available for new projects · Lagos, Nigeria
          </div>
        </FadeIn> */}
        <FadeIn delay={100}>
          <h1 className="text-[2rem] sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.05] max-w-5xl mx-auto">
            Transform your business with{" "}
            <span className="text-gradient">Savans digital solutions</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Custom websites, E-commerce stores, web applications, and inventory systems for Nigerian
            businesses. Built fast, designed to convert, engineered to scale.
          </p>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("start_project_click", { location: "hero" })}
              className="inline-flex items-center gap-2 rounded-full gradient-brand text-background font-medium px-6 py-3 hover:opacity-90 transition"
            >
              <MessageCircle className="size-4" /> Start Project
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-6 py-3 font-medium hover:bg-card transition"
            >
              View Work <ArrowUpRight className="size-4" />
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={400}>
          <div className="mt-16 grid grid-cols-3 max-w-2xl mx-auto gap-3 sm:gap-6 text-center">
            {[
              { v: "SEO", l: "Search-ready" },
              { v: "Fast", l: "Performance-first" },
              { v: "Secure", l: "Reliable setup" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-xl sm:text-3xl font-bold text-gradient whitespace-nowrap">
                  {s.v}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-snug">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* =========================================== SERVICES */
function Services() {
  const whatsappBase = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <section id="services" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Services"
            title="What we build"
            sub="End-to-end digital solutions that actually work."
          />
        </FadeIn>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            const whatsappHref = `${whatsappBase}?text=${encodeURIComponent(
              `Hi Savans! I'd like to learn more about ${s.title}.`,
            )}`;

            return (
              <FadeIn key={s.title} delay={i * 60}>
                <article className="glass rounded-2xl p-6 h-full flex flex-col hover:border-foreground/20 transition group">
                  <div className="size-11 rounded-xl gradient-brand grid place-items-center text-background mb-5 group-hover:scale-105 transition">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <ul className="mt-5 space-y-1.5 text-sm flex-1">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="size-3.5 mt-0.5 shrink-0 text-foreground" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-gradient">{s.price}</span>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("learn_more_click", { service: s.title })}
                      className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      Learn more <ArrowUpRight className="size-3" />
                    </a>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================== WORK */
function Work() {
  const [expanded, setExpanded] = useState(false);

  const toggleProjects = () => {
    if (expanded) {
      setExpanded(false);
      window.setTimeout(() => {
        document
          .getElementById("recent-work-mobile-anchor")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }

    setExpanded(true);
  };

  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Recent Work"
            title="Projects we've shipped"
            sub="A glimpse of platforms we've built for clients across Nigeria."
          />
        </FadeIn>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => {
            const images = "images" in p && Array.isArray(p.images) ? p.images : [p.image];
            const isHiddenOnMobile = !expanded && i >= 3;

            return (
              <FadeIn
                key={p.url}
                delay={i * 50}
                className={isHiddenOnMobile ? "hidden sm:block" : "block"}
              >
                <a
                  href={`https://${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={i === 2 ? "recent-work-mobile-anchor" : undefined}
                  className="block glass rounded-2xl p-4 sm:p-5 h-full hover:border-foreground/20 transition group"
                >
                  <div className="aspect-[16/10] rounded-xl bg-card mb-5 relative overflow-hidden border border-border">
                    {images.map((image, imageIndex) => (
                      <img
                        key={image}
                        src={image}
                        alt={`${p.name} project screenshot ${imageIndex + 1}`}
                        loading="lazy"
                        style={
                          images.length > 1 ? { animationDelay: `${imageIndex * 3.5}s` } : undefined
                        }
                        className={`size-full object-contain transition duration-500 group-hover:scale-105 ${
                          images.length > 1 ? "absolute inset-0 project-image-cycle" : ""
                        }`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.url}</p>
                    </div>
                    <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground transition" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{p.type}</p>
                  <p className="text-xs mt-3 text-gradient font-medium">{p.result}</p>
                </a>
              </FadeIn>
            );
          })}
        </div>
        {PROJECTS.length > 3 && (
          <div className="mt-4 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={toggleProjects}
              className="inline-flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse projects" : "Expand projects"}
            >
              <span className="grid size-11 place-items-center rounded-full border border-border bg-card/40 text-foreground hover:bg-card transition">
                <ChevronDown
                  className={`size-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
              </span>
              <span>{expanded ? "See less" : "See more"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================== PROCESS */
function Process() {
  return (
    <section id="process" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Process"
            title="How we work"
            sub="A clear, predictable path from idea to launch."
          />
        </FadeIn>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS.map((p, i) => (
            <FadeIn key={p.step} delay={i * 80}>
              <div className="glass rounded-2xl p-6 h-full min-h-[310px] flex flex-col">
                <div>
                  <div className="text-xs font-mono text-gradient mb-3">{p.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-border text-xs text-muted-foreground">
                  Timeline · <span className="text-foreground">{p.timeline}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================== TESTIMONIALS */
function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by Nigerian businesses"
            sub="See what our clients say."
          />
        </FadeIn>
        <div className="mt-14">
          <TestimonialsCarousel />
        </div>
      </div>
    </section>
  );
}

/* =========================================== PRICING */
function Pricing() {
  const whatsappBase = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Pricing"
            title="Transparent pricing"
            sub="Pick a tier or talk to us for custom project needs."
          />
        </FadeIn>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING.map((p, i) => {
            const displayPrice =
              p.price === "Custom" || p.price.toLowerCase().startsWith("from")
                ? p.price.replace(/^from\b/i, "From")
                : `From ${p.price}`;
            const whatsappHref = `${whatsappBase}?text=${encodeURIComponent(
              `Hi Savans! I'm interested in the ${p.name} plan.`,
            )}`;

            return (
              <FadeIn key={p.name} delay={i * 70}>
                <div
                  className={`relative h-full rounded-2xl p-6 flex flex-col ${p.popular ? "glass-strong border-foreground/30" : "glass"}`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold gradient-brand text-background px-3 py-1 rounded-full">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-base font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
                  <div className="mt-5 mb-5">
                    <div className="text-3xl font-bold">{displayPrice}</div>
                  </div>
                  <ul className="space-y-2 text-sm flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="size-3.5 mt-0.5 shrink-0 text-foreground" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("pricing_cta_click", {
                        plan: p.name,
                        price: displayPrice,
                      })
                    }
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${p.popular ? "gradient-brand text-background hover:opacity-90" : "border border-border hover:bg-card"}`}
                  >
                    {p.cta}
                  </a>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Custom pricing available · Milestone-based invoicing · Bank transfer & card accepted
        </p>
      </div>
    </section>
  );
}

/* =========================================== FAQ */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions"
            sub="Everything you need to know before reaching out."
          />
        </FadeIn>
        <div className="mt-12 grid gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={f.q} delay={i * 40}>
                <div className="glass rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-sm sm:text-base">{f.q}</span>
                    {isOpen ? (
                      <Minus className="size-4 shrink-0" />
                    ) : (
                      <Plus className="size-4 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================== CONTACT */
function Contact() {
  const wa = `https://wa.me/${CONTACT.whatsapp}`;
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Contact"
            title="Ready to start?"
            sub="Tell us about your project. We usually reply within a few hours."
          />
        </FadeIn>
        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <FadeIn>
            <div className="grid gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("contact_whatsapp_click", { location: "contact" })}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-foreground/20 transition"
              >
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  <MessageCircle className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">WhatsApp</div>
                  <div className="font-medium text-sm">Chat with us now</div>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-foreground/20 transition"
              >
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  <Phone className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Call</div>
                  <div className="font-medium text-sm">{CONTACT.phone}</div>
                </div>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-foreground/20 transition"
              >
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  <Mail className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium text-sm">{CONTACT.email}</div>
                </div>
              </a>
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="size-10 rounded-xl gradient-brand grid place-items-center text-background">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-medium text-sm">{CONTACT.location}</div>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* =========================================== FOOTER */
function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-8 text-sm">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-lg">
              <img
                src="/savans-logo.svg"
                alt="Savans Technologies logo"
                className="h-24 w-80 rounded-md object-contain"
              />
            </div>
            <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
              Web engineering studio building websites, e-commerce, and SaaS for Nigerian
              businesses.
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a href="#services" className="hover:text-foreground">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-muted-foreground text-sm break-words">
              <li>{CONTACT.email}</li>
              <li>{CONTACT.phone}</li>
              <li>{CONTACT.location}</li>
              <li className="pt-2">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Savans Technologies. All rights reserved.</p>
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

/* =========================================== HELPERS */
function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-[0.2em] text-gradient font-semibold">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight">{title}</h2>
      <p className="mt-4 text-muted-foreground">{sub}</p>
    </div>
  );
}

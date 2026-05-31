export const CONTACT = {
  whatsapp: "2348000000000", // TODO: replace with real WhatsApp number (no + sign)
  phone: "+234 800 000 0000",
  email: "hello@savanstech.com",
  location: "Lagos, Nigeria",
  domain: "https://savanstech.com",
};

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    icon: "Globe",
    title: "Website Development",
    desc: "Professional business websites that convert visitors to customers. Fast-loading, SEO-optimized, mobile-first design.",
    price: "from ₦250,000",
    features: ["Responsive design", "SEO setup", "Fast loading", "Mobile optimized", "CMS integration"],
  },
  {
    icon: "ShoppingCart",
    title: "E-Commerce Development",
    desc: "Full-featured online stores with payment integration, inventory sync, and customer management. Built to maximize sales.",
    price: "from ₦400,000",
    features: ["Product catalog", "Payment gateways", "Inventory management", "Order tracking", "Analytics"],
  },
  {
    icon: "Layers",
    title: "Custom Web Applications",
    desc: "Tailored web apps and SaaS platforms built for your specific business needs. Scalable, secure, and user-friendly.",
    price: "from ₦1,500,000",
    features: ["Custom development", "User authentication", "Database design", "API integration", "Admin dashboards"],
  },
  {
    icon: "Package",
    title: "Inventory Management Systems",
    desc: "Smart inventory tracking with AI insights. Real-time stock monitoring, automated alerts, and multi-location support.",
    price: "from ₦10,000/month",
    features: ["Real-time tracking", "AI insights", "Web + Mobile + Desktop", "Multi-location", "Automated alerts"],
  },
  {
    icon: "Settings",
    title: "Business Automations",
    desc: "Automate repetitive tasks and streamline workflows. CRM integration, email automation, invoicing, and data sync.",
    price: "from ₦500,000",
    features: ["Workflow automation", "API integrations", "Email sequences", "Data synchronization", "Custom tools"],
  },
  {
    icon: "Wrench",
    title: "Website Maintenance",
    desc: "Keep your site running smoothly. Regular updates, security patches, backups, performance tuning, and support.",
    price: "from ₦25,000/month",
    features: ["Regular backups", "Security updates", "Performance monitoring", "Technical support", "Uptime guarantee"],
  },
];

export const PROJECTS = [
  { name: "Nana Baby Essentials", url: "nanababyessentials.com", type: "E-commerce + Baby Registry", result: "30% increase in online orders" },
  { name: "Savans Pharmacy", url: "savanspharmacy.com", type: "Medication ordering & refills", result: "Streamlined prescription workflow" },
  { name: "Supplements.ng", url: "supplements.ng", type: "Supplement delivery across Lagos", result: "Launched same-day delivery online" },
  { name: "TopFrancais Academy", url: "topfrancais.com", type: "Online French school & LMS", result: "Scaled to nationwide enrollment" },
  { name: "Amos Pride", url: "amospride.com", type: "Personal portfolio", result: "Premium brand presence online" },
  { name: "PSN Ondo", url: "psnondo.org", type: "Membership platform", result: "100% increase in inquiries" },
  { name: "Aura Inventory", url: "aurainventory.app", type: "AI SaaS inventory platform", result: "60% reduction in stockouts" },
];

export const PROCESS = [
  { step: "01", title: "Discovery", desc: "We talk through your goals, users, and constraints to scope the build properly.", timeline: "1–3 days" },
  { step: "02", title: "Design", desc: "Clean wireframes and a focused UI direction — built to convert, not just decorate.", timeline: "3–7 days" },
  { step: "03", title: "Build", desc: "Production-grade code with modern stacks, secure auth, and clean data models.", timeline: "2–8 weeks" },
  { step: "04", title: "Launch", desc: "Deploy, monitor, and iterate — your platform stays fast and reliable.", timeline: "Ongoing" },
];

export const PRICING = [
  {
    name: "Starter",
    price: "₦250,000",
    tagline: "Single-page presence",
    features: ["1-page landing site", "Mobile responsive", "Basic SEO setup", "Contact form", "7-day delivery"],
    cta: "Start small",
    popular: false,
  },
  {
    name: "Business",
    price: "₦650,000",
    tagline: "Multi-page business website",
    features: ["Up to 8 pages", "Custom design system", "CMS / blog setup", "Advanced on-page SEO", "Analytics", "30-day support"],
    cta: "Build my site",
    popular: true,
  },
  {
    name: "Pro Web App",
    price: "₦1,500,000",
    tagline: "Custom web application",
    features: ["Full-stack build", "Auth & user dashboard", "Database & API design", "Payments integration", "Admin panel", "60-day support"],
    cta: "Build my app",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline: "SaaS & complex platforms",
    features: ["Architecture consulting", "Multi-tenant SaaS", "Dedicated engineer", "Scalable infrastructure", "Ongoing maintenance", "Priority SLA"],
    cta: "Let's talk",
    popular: false,
  },
];

export const TESTIMONIALS = [
  {
    quote: "Savans rebuilt our store end-to-end. Customers can finally check out smoothly and our team manages everything ourselves.",
    name: "Adaeze O.",
    role: "Founder",
    business: "NanaBaby Essentials",
    result: "30% increase in online orders",
    initials: "AO",
  },
  {
    quote: "Professional from day one. Communication was clear, delivery was on time, and the membership portal looks high-end.",
    name: "Pharm. Tunde",
    role: "Executive",
    business: "PSN Ondo",
    result: "100% increase in customer inquiries",
    initials: "PT",
  },
  {
    quote: "The pharmacy system is fast and easy to use. Refills, stock alerts, and patient profiles all live in one place.",
    name: "Pharm. Chika",
    role: "Pharmacist & Owner",
    business: "Savans Pharmacy",
    result: "60% reduction in stockouts",
    initials: "PC",
  },
  {
    quote: "Whenever I need anything — a new feature, a fix, an update — support is fast and reliable. It feels like having an in-house team.",
    name: "Daniel A.",
    role: "Product Lead",
    business: "SaaS Startup",
    result: "Ship cycle cut by 40%",
    initials: "DA",
  },
  {
    quote: "Honestly the best money we've spent. The platform paid for itself within months and keeps generating leads on autopilot.",
    name: "Mrs. Folake",
    role: "Director",
    business: "Education Brand",
    result: "3x more qualified inquiries",
    initials: "MF",
  },
];

export const FAQS = [
  { q: "How long does a typical project take?", a: "A landing page ships in about a week. Business sites take 2–4 weeks. Full web applications usually run 6–12 weeks depending on scope." },
  { q: "Do you only build the frontend, or backend too?", a: "Both. We're a full-stack team — UI, APIs, databases, auth, payments, and deployment under one roof so you have one accountable partner." },
  { q: "What technology stack do you use?", a: "Modern, battle-tested tools: React, Next.js, TypeScript, Node, PostgreSQL, and serverless infrastructure. The exact stack depends on what your project actually needs." },
  { q: "Are your websites SEO optimized?", a: "Yes. Every build ships with semantic HTML, structured data, sitemaps, fast Core Web Vitals, and on-page SEO baked in from day one." },
  { q: "Do you offer maintenance after launch?", a: "Yes. Every plan includes a support window, and ongoing maintenance retainers are available for updates, monitoring, and new features." },
  { q: "Can you redesign or rebuild an existing site?", a: "Absolutely. Migrations off WordPress, Wix, or legacy stacks onto something modern are a big part of our work." },
  { q: "What payment options do you accept?", a: "Bank transfer in Naira, card payments, and milestone-based invoicing. Typically 50% to start, balance on delivery." },
  { q: "Can the design be customized to match my brand?", a: "Every project is built around your brand — colors, typography, tone of voice — not a template. You'll see designs before we write code." },
];

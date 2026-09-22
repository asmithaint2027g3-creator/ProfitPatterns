/**
 * Single source of truth for site-wide configuration.
 * Change the WhatsApp number, email and address here only — never inline.
 */

/** Digits only, including country code. Replace with the real business number. */
export const WHATSAPP_NUMBER = "910000000000";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi, I visited ProfitPatterns and would like to know more about your AI and profit strategy consulting services.";

export const siteConfig = {
  name: "ProfitPatterns",
  positioning: "AI Profit Strategy Consulting",
  description:
    "ProfitPatterns helps businesses identify practical opportunities across AI, automation, data and process optimization — turning technology into a strategy for better efficiency, smarter decisions and sustainable business value.",
  email: "[INSERT VERIFIED BUSINESS EMAIL]",
  phone: "[INSERT VERIFIED PHONE]",
  whatsapp: "[INSERT VERIFIED WHATSAPP NUMBER]",
  responseTime: "We respond within one business day.",
  locationNote: "Remote-first. Working with teams across time zones.",
} as const;

export function whatsappUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  const safe = message.slice(0, 600);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(safe)}`;
}

export interface NavDropdownItem {
  label: string;
  description: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  dropdown?: NavDropdownItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "About",
    to: "/about",
    dropdown: [
      { label: "About ProfitPatterns", description: "Who we are and what we believe", to: "/about" },
      { label: "Our Approach", description: "How we examine business problems", to: "/about" },
      { label: "Why ProfitPatterns", description: "A business-first technology approach", to: "/about" },
      { label: "How We Work", description: "The five-step engagement process", to: "/how-it-works" },
      { label: "FAQ", description: "Common questions, answered plainly", to: "/faq" },
    ],
  },
  {
    label: "Solutions",
    to: "/solutions",
    dropdown: [
      { label: "AI Strategy Consulting", description: "Build an AI strategy around your business", to: "/solutions/ai-strategy" },
      { label: "Business Automation", description: "Automate the work that slows your business", to: "/solutions/business-automation" },
      { label: "Data & Analytics", description: "Turn business data into better decisions", to: "/solutions/data-analytics" },
      { label: "Process Optimization", description: "Make your business processes work better", to: "/solutions/process-optimization" },
      { label: "Digital Transformation", description: "Build a digital strategy that serves the business", to: "/solutions/digital-transformation" },
      { label: "Profit & Growth Strategy", description: "Find opportunities behind better performance", to: "/solutions/profit-growth-strategy" },
      { label: "AI Readiness Assessment", description: "Evaluate readiness before adopting AI", to: "/solutions/ai-readiness" },
    ],
  },
  {
    label: "Industries",
    to: "/industries",
    dropdown: [
      { label: "Startups", description: "Build smarter foundations for growth", to: "/industries/startups" },
      { label: "Small & Medium Businesses", description: "Practical strategies for growing businesses", to: "/industries/small-medium-businesses" },
      { label: "Professional Services", description: "Make knowledge-driven work more efficient", to: "/industries/professional-services" },
      { label: "Retail & E-Commerce", description: "Turn operations and data into decisions", to: "/industries/retail-ecommerce" },
      { label: "Financial & Business Services", description: "Build efficient, data-driven operations", to: "/industries/financial-business-services" },
      { label: "Operations-Driven Businesses", description: "Find the bottlenecks holding operations back", to: "/industries/operations-driven" },
      { label: "Growing Organizations", description: "Build systems that grow with the business", to: "/industries/growing-organizations" },
    ],
  },
  {
    label: "Insights",
    to: "/insights",
    dropdown: [
      { label: "AI Strategy", description: "Practical perspectives on AI opportunities", to: "/insights" },
      { label: "Business Automation", description: "What to automate and how to do it", to: "/insights" },
      { label: "Data & Analytics", description: "From data to decisions that matter", to: "/insights" },
      { label: "Process Optimization", description: "Finding and fixing process bottlenecks", to: "/insights" },
      { label: "Digital Transformation", description: "Building digital strategy that works", to: "/insights" },
      { label: "Profit & Growth", description: "Where businesses look for efficiency", to: "/insights" },
      { label: "AI Trends", description: "What new AI developments mean for business", to: "/insights" },
    ],
  },
  {
    label: "Resources",
    to: "/resources",
    dropdown: [
      { label: "AI Opportunity Assessment", description: "Find where AI could create value", to: "/resources/ai-opportunity-assessment" },
      { label: "Business Automation Checklist", description: "Which tasks could be automated?", to: "/resources/business-automation-checklist" },
      { label: "Business Process Review", description: "Review a process before automating it", to: "/resources/business-process-review" },
      { label: "AI Readiness Checklist", description: "Is your business ready for AI?", to: "/resources/ai-readiness-checklist" },
      { label: "ROI & Business Value Guide", description: "Think about value before investment", to: "/resources/roi-business-value-guide" },
      { label: "Case Studies", description: "See the thinking behind the work", to: "/resources/case-studies" },
    ],
  },
  {
    label: "Contact",
    to: "/contact",
    dropdown: [
      { label: "Talk to an Expert", description: "Tell us about your business challenge", to: "/contact" },
      { label: "Quick Enquiry", description: "Have a quick question? Send a message", to: "/contact" },
      { label: "Strategy Consultation", description: "Request a structured consultation", to: "/contact" },
      { label: "Chat on WhatsApp", description: "Start a conversation right now", to: "/contact" },
    ],
  },
];

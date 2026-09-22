export interface ProblemPattern {
  id: string;
  title: string;
  teaser: string;
  problem: string;
  opportunity: string;
  serviceTitle: string;
  serviceSlug: string;
  cta: string;
}

export const problemPatterns: ProblemPattern[] = [
  {
    id: "manual-work",
    title: "Too Much Manual Work",
    teaser: "Repetitive tasks consume employee time and slow down operations.",
    problem:
      "Repetitive tasks consume employee time, slow down operations and create unnecessary opportunities for error.",
    opportunity:
      "Automate high-frequency, rule-based workflows and redesign handoffs to reduce manual effort and free your team for higher-value work.",
    serviceTitle: "Business Automation",
    serviceSlug: "business-automation",
    cta: "Explore Automation",
  },
  {
    id: "operational-costs",
    title: "Rising Operational Costs",
    teaser: "Inefficient processes quietly increase costs as the business grows.",
    problem:
      "Inefficient processes can quietly increase operating costs as a business grows.",
    opportunity:
      "Identify where costs and delays accumulate step by step, then redesign the specific processes that carry them.",
    serviceTitle: "Process Optimization",
    serviceSlug: "process-optimization",
    cta: "Identify Opportunities",
  },
  {
    id: "data-direction",
    title: "Data Without Direction",
    teaser: "Businesses generate data, but data only creates value when it drives decisions.",
    problem:
      "Businesses generate large amounts of data, but data only becomes valuable when it supports better decisions.",
    opportunity:
      "Define the measures that matter most, agree on definitions once, and present them where decisions are actually made.",
    serviceTitle: "Data & Analytics",
    serviceSlug: "data-analytics",
    cta: "Explore Data & Analytics",
  },
  {
    id: "ai-without-strategy",
    title: "AI Without a Strategy",
    teaser: "AI tools without a clear objective create complexity, not value.",
    problem:
      "Using AI tools without a clear business objective can create complexity without creating meaningful value.",
    opportunity:
      "Identify practical AI use cases tied to real business problems, prioritize them by impact and feasibility, and build a structured roadmap.",
    serviceTitle: "AI Strategy Consulting",
    serviceSlug: "ai-strategy",
    cta: "Explore AI Strategy",
  },
  {
    id: "growth-without-systems",
    title: "Growth Without Systems",
    teaser: "Processes that work at small scale become bottlenecks during growth.",
    problem:
      "Processes that work at a small scale can become bottlenecks when the business starts growing.",
    opportunity:
      "Build the operating systems and profit model that make growth repeatable and sustainable rather than dependent on heroics.",
    serviceTitle: "Profit & Growth Strategy",
    serviceSlug: "profit-growth-strategy",
    cta: "Optimize Your Processes",
  },
];

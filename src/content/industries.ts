export interface Industry {
  slug: string;
  title: string;
  headline: string;
  intro: string;
  focus: string[];
  cta: string;
  relatedSolutions: string[];
}

export const industries: Industry[] = [
  {
    slug: "startups",
    title: "Startups",
    headline: "Build Smarter Foundations for Growth.",
    intro:
      "Startups need to move quickly without creating unnecessary operational complexity. ProfitPatterns can help identify opportunities to build scalable processes, use data effectively and evaluate where automation or AI may support growth.",
    focus: [
      "Process design and scalable workflows",
      "Business automation for lean teams",
      "Data strategy and early analytics",
      "AI readiness and opportunity identification",
      "Digital foundation and tool selection",
    ],
    cta: "Discuss Your Startup",
    relatedSolutions: ["ai-strategy", "business-automation", "ai-readiness"],
  },
  {
    slug: "small-medium-businesses",
    title: "Small & Medium Businesses",
    headline: "Practical Technology Strategies for Growing Businesses.",
    intro:
      "Smaller businesses often need technology solutions that are practical, focused and aligned with available resources. ProfitPatterns works with growing businesses to identify where technology can make the most meaningful difference.",
    focus: [
      "Business automation for repetitive workflows",
      "Analytics and reporting improvements",
      "Process optimization and efficiency",
      "AI opportunity identification",
      "Practical digital transformation",
    ],
    cta: "Explore Your Opportunities",
    relatedSolutions: ["business-automation", "process-optimization", "data-analytics"],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    headline: "Make Knowledge-Driven Work More Efficient.",
    intro:
      "Professional services firms generate significant knowledge work. ProfitPatterns can help identify opportunities to reduce repetitive administrative work, improve data and reporting, and build processes that support growth.",
    focus: [
      "Workflow automation for repetitive tasks",
      "Document and information workflows",
      "Data, reporting and business intelligence",
      "Knowledge management and process design",
      "Process optimization for client delivery",
    ],
    cta: "Discuss Your Workflow",
    relatedSolutions: ["business-automation", "process-optimization", "data-analytics"],
  },
  {
    slug: "retail-ecommerce",
    title: "Retail & E-Commerce",
    headline: "Turn Operations and Data Into Better Decisions.",
    intro:
      "Retail and e-commerce businesses generate significant operational data. ProfitPatterns can help identify opportunities to use that data more effectively, improve operational efficiency and automate repetitive workflows.",
    focus: [
      "Customer analytics and behavior analysis",
      "Inventory and operational processes",
      "Reporting and business intelligence",
      "Workflow automation",
      "Operational efficiency improvement",
    ],
    cta: "Discuss Your Business",
    relatedSolutions: ["data-analytics", "business-automation", "process-optimization"],
  },
  {
    slug: "financial-business-services",
    title: "Financial & Business Services",
    headline: "Build More Efficient, Data-Driven Operations.",
    intro:
      "Financial and business services organizations often handle high volumes of structured, rule-based work. ProfitPatterns can help identify opportunities to automate workflows, improve reporting and build more efficient operations.",
    focus: [
      "Workflow automation for rule-based processes",
      "Reporting and data analysis improvements",
      "Process standardization and efficiency",
      "Decision-support analytics",
      "AI strategy and readiness",
    ],
    cta: "Explore Opportunities",
    relatedSolutions: ["business-automation", "data-analytics", "ai-strategy"],
  },
  {
    slug: "operations-driven",
    title: "Operations-Driven Businesses",
    headline: "Find the Bottlenecks Holding Operations Back.",
    intro:
      "Operations-intensive businesses often have significant opportunities to reduce manual work, eliminate bottlenecks and improve process efficiency. ProfitPatterns helps identify where improvement can make the most difference.",
    focus: [
      "Process mapping and bottleneck identification",
      "Workflow optimization and redesign",
      "Business automation",
      "Operational reporting and analytics",
      "Continuous improvement frameworks",
    ],
    cta: "Review Your Process",
    relatedSolutions: ["process-optimization", "business-automation", "data-analytics"],
  },
  {
    slug: "growing-organizations",
    title: "Growing Organizations",
    headline: "Build Systems That Can Grow With Your Business.",
    intro:
      "Growth puts pressure on processes, systems and teams. ProfitPatterns can help growing organizations build the digital strategy, automation and data capabilities needed to scale without unnecessary complexity.",
    focus: [
      "Process scalability and redesign",
      "Digital strategy and transformation",
      "Business automation",
      "Data strategy and analytics",
      "AI adoption and readiness",
    ],
    cta: "Discuss Your Growth Goals",
    relatedSolutions: ["digital-transformation", "process-optimization", "ai-strategy"],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

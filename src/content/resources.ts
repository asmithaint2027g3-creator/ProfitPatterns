export interface Resource {
  slug: string;
  title: string;
  description: string;
  intro: string;
  cta: string;
  relatedSolution?: string;
}

export const resources: Resource[] = [
  {
    slug: "ai-opportunity-assessment",
    title: "AI Opportunity Assessment",
    description:
      "A structured framework for identifying processes, decisions and workflows where AI may provide practical value.",
    intro:
      "Not every business problem needs an AI solution. This framework helps you examine your workflows, decisions and data environment to identify where AI could make a meaningful difference — and where it may not be the right answer.",
    cta: "Start Assessment",
    relatedSolution: "ai-strategy",
  },
  {
    slug: "business-automation-checklist",
    title: "Business Automation Checklist",
    description:
      "Use this checklist to identify repetitive, rule-based and time-consuming activities that may be suitable for automation.",
    intro:
      "Before automating a process, it helps to have a clear view of which activities are genuinely candidates for automation. This checklist identifies the characteristics of work that automation handles well — and the conditions that need to be in place before automation makes sense.",
    cta: "View Checklist",
    relatedSolution: "business-automation",
  },
  {
    slug: "business-process-review",
    title: "Business Process Review",
    description:
      "A practical framework for identifying unnecessary steps, bottlenecks, dependencies and improvement opportunities.",
    intro:
      "Process improvement starts with understanding how a process actually works — not how it was documented. This review framework helps you map a process as it really runs, identify where time and cost accumulate, and find opportunities to simplify before adding technology.",
    cta: "Review Your Process",
    relatedSolution: "process-optimization",
  },
  {
    slug: "ai-readiness-checklist",
    title: "AI Readiness Checklist",
    description:
      "Evaluate your objectives, data, processes, technology and organizational readiness before starting an AI initiative.",
    intro:
      "Successful AI adoption depends on more than tool selection. This checklist evaluates the foundational conditions that determine whether an AI initiative is likely to succeed — across six key dimensions: objectives, data, processes, technology, team readiness and governance.",
    cta: "Check AI Readiness",
    relatedSolution: "ai-readiness",
  },
  {
    slug: "roi-business-value-guide",
    title: "ROI & Business Value Guide",
    description:
      "A practical framework for considering costs, efficiency, measurable outcomes and strategic value before investing in a technology initiative.",
    intro:
      "Before investing in any technology initiative, it is worth thinking clearly about what business value actually means in your context. This guide provides a practical framework for thinking about costs, efficiency gains, measurable outcomes and strategic value — without overpromising or making unsupported assumptions.",
    cta: "Read the Guide",
    relatedSolution: "profit-growth-strategy",
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description:
      "Practical examples that demonstrate how strategy, technology and business objectives can come together.",
    intro:
      "We are building a collection of practical examples that demonstrate how business challenges can be translated into strategies, technology solutions and measurable outcomes. Only verified case studies will be published here.",
    cta: "Discuss Your Business Challenge",
    relatedSolution: undefined,
  },
];

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

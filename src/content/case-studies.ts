/**
 * Case studies are structured placeholders.
 * No client names, revenue figures, percentages or testimonials are invented.
 * Replace `metrics[].value` and `client` once verified information is available.
 */

export interface CaseStudyMetric {
  label: string;
  /** Leave as null until a verified figure is available. */
  value: string | null;
  note: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  sector: string;
  serviceSlug: string;
  /** Null until the client approves being named. */
  client: string | null;
  summary: string;
  challenge: string;
  context: string;
  approach: string[];
  solution: string;
  technology: string[];
  implementation: string[];
  outcome: string;
  metrics: CaseStudyMetric[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "reactive-reporting-to-proactive-profit",
    title: "From reactive reporting to proactive profit",
    sector: "Mid-market operations",
    serviceSlug: "data-analytics",
    client: null,
    summary:
      "An operator with rising costs and conflicting reports rebuilt its decision layer around a small set of agreed measures.",
    challenge:
      "Operational costs were climbing and the leadership team could not agree on which numbers described the business. Each function maintained its own report, and monthly reviews were spent reconciling figures rather than making decisions.",
    context:
      "A multi-site operation with several years of accumulated reporting, three overlapping systems and no single owner for metric definitions.",
    approach: [
      "Started from the recurring decisions leadership needed to make each month.",
      "Documented every existing report and the definition behind each figure.",
      "Agreed a single definition and owner for each core measure.",
      "Consolidated the reporting path and retired duplicate reports.",
      "Established a monthly review format built around decisions, not slides.",
    ],
    solution:
      "A consolidated decision layer: a short set of owned measures, one reporting path, and role-specific views for operators, managers and leadership.",
    technology: [
      "Existing BI platform (retained)",
      "Consolidated source of record",
      "Documented metric definitions",
    ],
    implementation: [
      "Week 1–2: decision and report inventory",
      "Week 3–4: definition workshops and sign-off",
      "Week 5–7: reporting consolidation and view build",
      "Week 8: review format rollout and handover",
    ],
    outcome:
      "Reviews shifted from reconciling numbers to acting on them, with a single owned definition behind each measure. Quantified outcomes are tracked against the baseline agreed at the start of the engagement.",
    metrics: [
      { label: "Efficiency", value: null, note: "Measured against the agreed baseline" },
      { label: "Cost impact", value: null, note: "Tracked over the review cycle" },
      { label: "Decision speed", value: null, note: "Time from report to decision" },
    ],
  },
  {
    slug: "manual-workflows-to-automated-operations",
    title: "Manual workflows to automated operations",
    sector: "Professional services",
    serviceSlug: "business-automation",
    client: null,
    summary:
      "A services team mapped its highest-frequency manual workflows and automated the ones where automation genuinely held.",
    challenge:
      "Delivery staff spent a significant share of each week on data re-entry, status chasing and document assembly, which constrained how many engagements the team could run.",
    context:
      "A growing team operating across several systems that did not talk to each other, with process knowledge held informally by long-tenured staff.",
    approach: [
      "Inventoried workflows by frequency, duration and error rate.",
      "Separated work to eliminate from work to automate.",
      "Designed target workflows including exception paths.",
      "Built automation against the existing systems rather than replacing them.",
      "Instrumented the workflows so failures surface quickly.",
    ],
    solution:
      "A set of automated workflows covering intake, document assembly and status updates, with explicit human checkpoints where judgment is required.",
    technology: [
      "Workflow automation on the existing stack",
      "System integrations via available APIs",
      "Operational monitoring view",
    ],
    implementation: [
      "Phase 1: workflow inventory and prioritisation",
      "Phase 2: target-state design and sign-off",
      "Phase 3: build and pilot with one delivery team",
      "Phase 4: rollout, documentation and monitoring handover",
    ],
    outcome:
      "Manual handoffs were reduced and exception handling became visible rather than invisible. Capacity released is tracked against the pre-engagement baseline.",
    metrics: [
      { label: "Hours released", value: null, note: "Per week, against baseline" },
      { label: "Error rate", value: null, note: "Exceptions per 100 runs" },
      { label: "Cycle time", value: null, note: "Intake to completion" },
    ],
  },
  {
    slug: "ai-pilots-to-a-prioritised-roadmap",
    title: "AI pilots to a prioritised roadmap",
    sector: "Product and operations",
    serviceSlug: "ai-strategy",
    client: null,
    summary:
      "A business with several disconnected AI pilots consolidated them into a single sequenced roadmap tied to business objectives.",
    challenge:
      "Multiple teams had started AI experiments independently. Spend was rising, no pilot had a defined success measure, and leadership could not decide what to fund next.",
    context:
      "A business with reasonable data maturity in some functions and none in others, plus real concerns about data handling and review.",
    approach: [
      "Catalogued every active and abandoned pilot with its actual cost.",
      "Assessed data readiness and capability function by function.",
      "Scored candidate use cases on impact, effort, risk and time to value.",
      "Defined guardrails for data handling and human review.",
      "Produced a sequenced roadmap with decision gates.",
    ],
    solution:
      "A single prioritised roadmap, a short list of use cases worth funding, and explicit guardrails covering data handling and human oversight.",
    technology: [
      "Use-case scoring model",
      "Data readiness assessment",
      "Governance and review guardrails",
    ],
    implementation: [
      "Stage 1: pilot audit and cost consolidation",
      "Stage 2: readiness assessment",
      "Stage 3: scoring and prioritisation workshops",
      "Stage 4: roadmap, guardrails and measurement plan",
    ],
    outcome:
      "Fragmented experimentation was replaced by a funded, sequenced roadmap with a success measure attached to every item.",
    metrics: [
      { label: "Pilots consolidated", value: null, note: "Active pilots at audit" },
      { label: "Use cases funded", value: null, note: "After prioritisation" },
      { label: "Time to first outcome", value: null, note: "From roadmap approval" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

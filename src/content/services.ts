export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  code: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  opportunity: string;
  approach: string[];
  deliverables: string[];
  objective: string;
  faqs: ServiceFaq[];
}

export const services: Service[] = [
  {
    slug: "ai-strategy",
    code: "AI",
    title: "AI Strategy",
    tagline: "Practical AI use cases mapped to real profit levers.",
    summary:
      "Move from scattered AI experiments to a sequenced roadmap where every use case is tied to a business objective.",
    problem:
      "Teams adopt AI tools piecemeal. Pilots run, subscriptions accumulate, and nothing reaches the operating numbers. Leadership cannot tell which experiments deserve investment.",
    opportunity:
      "Identify the handful of AI use cases with genuine business leverage in your context, sequence them by impact and feasibility, and set the measurement that proves whether they worked.",
    approach: [
      "Map the value chain and locate where decisions, judgment and repetition concentrate.",
      "Assess data readiness, tooling and team capability honestly before recommending anything.",
      "Score candidate use cases on business impact, effort, risk and time to value.",
      "Define guardrails: data handling, human review points, and acceptable failure modes.",
      "Produce a sequenced roadmap with owners, success measures and decision gates.",
    ],
    deliverables: [
      "AI opportunity map across functions",
      "Prioritised use-case shortlist with scoring rationale",
      "Data and capability readiness assessment",
      "Sequenced implementation roadmap",
      "Governance and risk guardrails",
      "Measurement plan with a baseline",
    ],
    objective:
      "A clear, defensible view of where AI can support your business objectives — and what to do first.",
    faqs: [
      {
        question: "Do we need clean data before starting?",
        answer:
          "No. Part of the work is establishing what data you actually have and which use cases are viable given that reality. Data improvement becomes a sequenced part of the roadmap rather than a prerequisite.",
      },
      {
        question: "Will you recommend specific tools?",
        answer:
          "Where a tool choice matters we make a recommendation with the trade-offs stated. We are not resellers, and the roadmap stays valid if you choose differently.",
      },
      {
        question: "How long does an AI strategy engagement take?",
        answer:
          "Scope depends on the size and complexity of the organisation. We agree the scope and timeline in writing before work starts.",
      },
    ],
  },
  {
    slug: "business-automation",
    code: "AU",
    title: "Business Automation",
    tagline: "Remove repetitive work and free teams to focus on value.",
    summary:
      "Identify the workflows that consume the most hours, then automate the ones where automation genuinely holds.",
    problem:
      "Skilled people spend their days on copy-paste, reconciliation, chasing approvals and re-entering the same information into different systems. Capacity is consumed before real work begins.",
    opportunity:
      "Target high-frequency, rule-based workflows where automation is durable, and redesign the handoffs around them so the gains are not lost to exception handling.",
    approach: [
      "Inventory workflows by frequency, duration and error rate.",
      "Separate work that should be automated from work that should simply be eliminated.",
      "Design the target workflow, including exception paths and human checkpoints.",
      "Build or configure automation against the existing systems where possible.",
      "Instrument the workflow so throughput and failure rates are visible.",
    ],
    deliverables: [
      "Workflow inventory with effort estimates",
      "Automation candidate shortlist",
      "Target-state process designs",
      "Implemented automations or build specifications",
      "Exception-handling and escalation model",
      "Operational monitoring view",
    ],
    objective:
      "Fewer manual handoffs, more predictable operations, and capacity released back to the team.",
    faqs: [
      {
        question: "Does automation mean replacing staff?",
        answer:
          "In most engagements the goal is capacity, not headcount reduction. We are explicit about intent at the start because it changes how the work is designed and communicated.",
      },
      {
        question: "Will this work with our existing systems?",
        answer:
          "We design around what you already run wherever that is viable. Replacing a system is a recommendation of last resort, made only when the cost of working around it is higher.",
      },
    ],
  },
  {
    slug: "data-analytics",
    code: "DA",
    title: "Data & Analytics",
    tagline: "Turn scattered data into decisions you can act on.",
    summary:
      "Build a decision layer: fewer dashboards, better questions, and numbers people actually trust.",
    problem:
      "Reports exist in several places and disagree with each other. Meetings start with arguments about whose number is right, and decisions revert to instinct.",
    opportunity:
      "Define the small set of measures that drive the business, agree the definitions once, and present them where the decisions are made.",
    approach: [
      "Start from the decisions, not the data: which recurring decisions need better evidence?",
      "Agree metric definitions and ownership in writing.",
      "Consolidate sources and establish a trustworthy reporting path.",
      "Design lean views for each audience — operators, managers, leadership.",
      "Set a review rhythm so the measures stay connected to action.",
    ],
    deliverables: [
      "Decision-to-metric map",
      "Agreed metric definitions and owners",
      "Consolidated reporting structure",
      "Role-specific dashboards or views",
      "Data quality issues register",
      "Reporting cadence and review format",
    ],
    objective:
      "Decisions supported by numbers the team agrees on, available when the decision is being made.",
    faqs: [
      {
        question: "Do we need a data warehouse?",
        answer:
          "Sometimes. Often the first gains come from agreeing definitions and consolidating a handful of sources. We recommend infrastructure only when the requirement justifies it.",
      },
      {
        question: "Can you work with our existing BI tool?",
        answer:
          "Yes. The value sits in the decision model and definitions, which carry across tools.",
      },
    ],
  },
  {
    slug: "process-optimization",
    code: "PO",
    title: "Process Optimization",
    tagline: "Streamline operations to cut cost and lift throughput.",
    summary:
      "Redesign the operational processes that carry the most cost, delay and rework.",
    problem:
      "Operating costs rise faster than revenue. Work waits between steps, gets reworked, or passes through approvals that no longer serve a purpose.",
    opportunity:
      "Measure where time and cost actually accumulate, then redesign those specific steps rather than launching a broad change programme.",
    approach: [
      "Map the end-to-end process as it really runs, not as documented.",
      "Quantify waiting time, rework and cost per step.",
      "Remove, simplify or reorder steps before adding technology.",
      "Pilot the redesigned process with a single team.",
      "Roll out with training, documentation and a measurement baseline.",
    ],
    deliverables: [
      "Current-state process map with measurements",
      "Cost and delay analysis by step",
      "Redesigned target process",
      "Pilot results and learnings",
      "Rollout plan and operating documentation",
    ],
    objective:
      "Lower operational friction and a process the team can run consistently.",
    faqs: [
      {
        question: "How disruptive is this to daily operations?",
        answer:
          "We pilot with one team before any broad rollout, so disruption is contained and the design is tested against reality first.",
      },
      {
        question: "Is this the same as automation?",
        answer:
          "No. Optimisation comes first: automating a poorly designed process only makes the wrong thing happen faster.",
      },
    ],
  },
  {
    slug: "digital-transformation",
    code: "DT",
    title: "Digital Transformation",
    tagline: "Modernize the systems that hold your business together.",
    summary:
      "A sequenced modernisation plan that keeps the business running while the stack changes.",
    problem:
      "Core systems constrain what the business can offer. Workarounds have hardened into process, and every change takes longer than it should.",
    opportunity:
      "Modernise in sequence, prioritised by business constraint rather than technical preference, with each step delivering usable value.",
    approach: [
      "Assess the current landscape: systems, integrations, ownership and constraints.",
      "Identify which constraints actually limit business outcomes.",
      "Define a target architecture that is reachable in increments.",
      "Sequence the programme so each increment stands on its own.",
      "Establish change management alongside the technical work.",
    ],
    deliverables: [
      "Current system and integration landscape",
      "Constraint analysis tied to business outcomes",
      "Target architecture outline",
      "Incremental transformation roadmap",
      "Risk register and change approach",
    ],
    objective:
      "A modernisation path the business can fund, absorb and measure — without a big-bang rewrite.",
    faqs: [
      {
        question: "Do you implement, or only advise?",
        answer:
          "Both are possible. We scope delivery support explicitly so responsibilities are clear from the start.",
      },
      {
        question: "How do you avoid a stalled transformation programme?",
        answer:
          "Each increment has to deliver standalone value and pass a decision gate. If an increment stops making sense, the programme changes rather than continuing on momentum.",
      },
    ],
  },
  {
    slug: "profit-growth-strategy",
    code: "PG",
    title: "Profit & Growth Strategy",
    tagline: "Align every initiative to a measurable business objective.",
    summary:
      "Connect pricing, cost structure and growth activity into one model leadership can steer with.",
    problem:
      "Growth arrives but margin does not follow. Initiatives compete for the same resources with no shared view of which ones move the business.",
    opportunity:
      "Build a single profit model that makes the levers explicit, then prioritise the initiative portfolio against it.",
    approach: [
      "Build a profit model covering the main revenue and cost drivers.",
      "Test the sensitivity of each lever before recommending changes.",
      "Review the current initiative portfolio against the model.",
      "Recommend what to start, continue and stop.",
      "Define the measurement that tracks whether the model holds.",
    ],
    deliverables: [
      "Profit driver model",
      "Lever sensitivity analysis",
      "Initiative portfolio review",
      "Prioritised recommendation set",
      "Tracking framework with a baseline",
    ],
    objective:
      "A shared, evidence-based view of where profit comes from and which initiatives deserve investment.",
    faqs: [
      {
        question: "Do you guarantee a specific financial result?",
        answer:
          "No. Outcomes depend on market conditions, execution and factors outside any consultant's control. We commit to rigorous analysis, clear recommendations and honest measurement.",
      },
      {
        question: "Who needs to be involved?",
        answer:
          "Typically finance, operations and commercial leadership. The model is only useful if the people who own the levers agree with it.",
      },
    ],
  },
  {
    slug: "ai-readiness",
    code: "AR",
    title: "AI Readiness Assessment",
    tagline: "Evaluate your readiness before committing to AI adoption.",
    summary:
      "Successful AI adoption depends on more than selecting an AI tool. Assess whether your business has the processes, data, technology and organizational readiness to succeed.",
    problem:
      "Businesses often invest in AI tools before evaluating whether the foundational conditions for success are in place — leading to underperforming projects and wasted investment.",
    opportunity:
      "A structured assessment across objectives, data, processes, technology infrastructure and team readiness identifies exactly where gaps exist before any investment is made.",
    approach: [
      "Evaluate current business objectives and where AI could realistically support them.",
      "Assess data availability, quality and accessibility across key processes.",
      "Review process maturity and identify dependencies that would affect AI adoption.",
      "Examine the existing technology environment and integration readiness.",
      "Assess team readiness, capability and governance considerations.",
      "Produce a readiness score with specific recommendations for each area.",
    ],
    deliverables: [
      "AI readiness scorecard across six dimensions",
      "Gap analysis by area",
      "Prioritised readiness improvement plan",
      "AI use case shortlist aligned to readiness level",
      "Governance and risk considerations",
      "Recommended next steps",
    ],
    objective:
      "A clear picture of where your business stands relative to AI adoption — and a practical path to improve readiness before committing to implementation.",
    faqs: [
      {
        question: "How long does the assessment take?",
        answer:
          "The timeline depends on the size and complexity of the business. We agree the scope and format in writing before starting.",
      },
      {
        question: "What happens after the assessment?",
        answer:
          "The assessment produces a clear readiness picture and recommendations. From there you can choose to address gaps, move forward with specific AI use cases or request a full AI strategy engagement.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export interface FrameworkStage {
  number: string;
  title: string;
  short: string;
  description: string;
  outputs: string[];
}

export const frameworkStages: FrameworkStage[] = [
  {
    number: "01",
    title: "Discover",
    short: "Understand goals",
    description:
      "Understand the business, its goals and its real constraints — including the ones nobody writes down.",
    outputs: ["Goal and constraint map", "Stakeholder view", "Scope agreement"],
  },
  {
    number: "02",
    title: "Diagnose",
    short: "Map opportunities",
    description:
      "Locate where value is leaking and quantify the gap between the current and target state.",
    outputs: ["Opportunity map", "Baseline measurements", "Prioritised gaps"],
  },
  {
    number: "03",
    title: "Design",
    short: "Build the roadmap",
    description:
      "Design the appropriate AI, automation or strategy response and sequence it by impact and feasibility.",
    outputs: ["Target design", "Sequenced roadmap", "Decision gates"],
  },
  {
    number: "04",
    title: "Implement",
    short: "Ship the solution",
    description:
      "Deliver in measurable increments alongside your team, so capability stays in the business.",
    outputs: ["Working increments", "Documentation", "Team enablement"],
  },
  {
    number: "05",
    title: "Measure",
    short: "Track outcomes",
    description:
      "Track outcomes against the baseline set at the start, and adjust based on what the numbers show.",
    outputs: ["Outcome tracking", "Review cadence", "Next-cycle recommendations"],
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description: "Understand business goals.",
    detail:
      "We start with your objectives, not our services. Sessions with the people who own the outcomes, a review of how the business actually runs, and an honest scope conversation.",
  },
  {
    number: "02",
    title: "Opportunity Mapping",
    description: "Identify high-value opportunities.",
    detail:
      "We map where value is being lost or left unclaimed, quantify what we can, and score opportunities on impact, effort and risk.",
  },
  {
    number: "03",
    title: "Solution Design",
    description: "Create the appropriate AI, automation or strategy roadmap.",
    detail:
      "The response is designed around the diagnosis: sometimes AI, often automation or process redesign, occasionally simply stopping something.",
  },
  {
    number: "04",
    title: "Execution",
    description: "Implement the solution.",
    detail:
      "Delivery happens in increments with your team involved throughout, so the capability remains after the engagement ends.",
  },
  {
    number: "05",
    title: "Measurement",
    description: "Track outcomes and optimize.",
    detail:
      "We measure against the baseline agreed at the start and report honestly — including where results fall short of expectation.",
  },
];

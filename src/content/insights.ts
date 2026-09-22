export const insightCategories = [
  "AI Strategy",
  "Business Automation",
  "Data Analytics",
  "Profit Optimization",
  "Digital Transformation",
  "Business Growth",
  "AI Trends",
] as const;

export type InsightCategory = (typeof insightCategories)[number];

export interface InsightSection {
  heading: string;
  body: string[];
}

export interface Insight {
  slug: string;
  title: string;
  category: InsightCategory;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  sections: InsightSection[];
}

export const insights: Insight[] = [
  {
    slug: "why-most-ai-pilots-never-reach-the-p-and-l",
    title: "Why most AI pilots never reach the P&L",
    category: "AI Strategy",
    excerpt:
      "The failure is rarely technical. Pilots stall because no one agreed in advance what a successful outcome would look like in business terms.",
    publishedAt: "2026-02-10",
    readingMinutes: 6,
    sections: [
      {
        heading: "The pilot that cannot fail cannot succeed",
        body: [
          "A pilot without a defined success measure has no way to end. It cannot be declared a success, so it cannot be scaled. It cannot be declared a failure, so it cannot be stopped. It simply continues, absorbing attention and budget.",
          "Before any experiment starts, write down the business measure it is intended to move, the current value of that measure, and the threshold at which you would fund the next stage.",
        ],
      },
      {
        heading: "Technical success is not business success",
        body: [
          "A model can perform well on its own terms while changing nothing about how work gets done. The gap is usually the workflow around it: who acts on the output, what they do differently, and whether that action is actually faster or better than before.",
          "Design the workflow change at the same time as the capability. If you cannot describe what someone will do differently on Monday morning, the pilot is not ready.",
        ],
      },
      {
        heading: "Sequence by leverage, not by enthusiasm",
        body: [
          "The most enthusiastic team is not always sitting on the highest-leverage opportunity. Score candidates on business impact, effort, risk and time to value, and be willing to say no to interesting work that does not move the business.",
        ],
      },
    ],
  },
  {
    slug: "automate-last-eliminate-first",
    title: "Automate last, eliminate first",
    category: "Business Automation",
    excerpt:
      "Automating a process you should have deleted is the most expensive way to keep a bad habit.",
    publishedAt: "2026-01-28",
    readingMinutes: 5,
    sections: [
      {
        heading: "The order matters",
        body: [
          "Before automating a workflow, ask three questions in order: can this step be removed entirely, can it be simplified, and only then — should it be automated?",
          "Many organisations skip the first two because automation feels like progress while elimination feels like admitting the process was wrong.",
        ],
      },
      {
        heading: "Exceptions decide the outcome",
        body: [
          "Automation gains are usually lost in exception handling. If ten per cent of cases fall out of the automated path and each one takes longer to resolve than it did manually, the net gain can be zero or negative.",
          "Measure the exception rate during the pilot, not after rollout.",
        ],
      },
    ],
  },
  {
    slug: "the-dashboard-that-changes-no-decision",
    title: "The dashboard that changes no decision",
    category: "Data Analytics",
    excerpt:
      "If no one can name a decision that would change based on a chart, the chart is decoration.",
    publishedAt: "2026-01-14",
    readingMinutes: 4,
    sections: [
      {
        heading: "Start from the decision",
        body: [
          "Useful analytics work begins with a recurring decision and works backwards to the evidence required. Starting from available data produces dashboards that describe the past without informing the next choice.",
        ],
      },
      {
        heading: "Fewer measures, agreed definitions",
        body: [
          "A small set of measures with agreed definitions and named owners beats a comprehensive set that each function interprets differently. The disagreement is the real problem; the tooling rarely is.",
        ],
      },
    ],
  },
  {
    slug: "where-profit-actually-leaks",
    title: "Where profit actually leaks",
    category: "Profit Optimization",
    excerpt:
      "Margin rarely disappears in one dramatic place. It drains through waiting time, rework and decisions made too late.",
    publishedAt: "2025-12-18",
    readingMinutes: 6,
    sections: [
      {
        heading: "Look between the steps",
        body: [
          "Cost analysis usually examines steps. Waiting happens between them — waiting for approval, information, or someone to become available. Mapping elapsed time alongside worked time often reveals more than a cost breakdown does.",
        ],
      },
      {
        heading: "Rework is the quiet cost",
        body: [
          "Rework is rarely measured because it is rarely logged. A simple tally over two weeks is usually enough to show whether it is material.",
        ],
      },
    ],
  },
  {
    slug: "modernisation-without-the-big-bang",
    title: "Modernisation without the big bang",
    category: "Digital Transformation",
    excerpt:
      "Transformation programmes fail slowly. Increments that each stand on their own are the antidote.",
    publishedAt: "2025-12-02",
    readingMinutes: 5,
    sections: [
      {
        heading: "Every increment earns its place",
        body: [
          "Structure the programme so each increment delivers usable value independently. If funding stops after increment two, the business should still be better off than before increment one.",
        ],
      },
      {
        heading: "Decision gates, not milestones",
        body: [
          "A milestone asks whether you are on schedule. A decision gate asks whether continuing is still the right choice. Programmes that only track milestones continue on momentum long after the rationale has changed.",
        ],
      },
    ],
  },
  {
    slug: "growth-that-does-not-break-operations",
    title: "Growth that doesn't break operations",
    category: "Business Growth",
    excerpt:
      "The processes that carried you to the first stage of growth are usually the ones that fail at the second.",
    publishedAt: "2025-11-20",
    readingMinutes: 5,
    sections: [
      {
        heading: "Heroics do not scale",
        body: [
          "Early growth often runs on a few people who know how everything works. That is efficient until those people become the bottleneck for every decision.",
          "Documenting and systematising that knowledge is unglamorous and usually the highest-return work available.",
        ],
      },
      {
        heading: "Watch cost to serve",
        body: [
          "If the cost of serving each additional customer is rising, growth is making the business harder, not stronger. Track it explicitly before scaling acquisition.",
        ],
      },
    ],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

export function relatedInsights(current: Insight, limit = 3): Insight[] {
  const sameCategory = insights.filter(
    (i) => i.slug !== current.slug && i.category === current.category,
  );
  const others = insights.filter((i) => i.slug !== current.slug && i.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

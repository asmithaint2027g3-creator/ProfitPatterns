export interface ICPSegment {
  id: string;
  anchor: string;
  title: string;
  positioning: string;
  reality: string;
  whatsAtStake: string[];
  howWeHelp: string[];
  typicalOutcomes: string[];
  ctaText: string;
  supportingDescription: string;
}

export const whoWeServeSegments: ICPSegment[] = [
  {
    id: "cxos-enterprise-leaders",
    anchor: "cxos-enterprise-leaders",
    title: "CXOs & Enterprise Leaders",
    positioning: "For CEOs, COOs & CFOs Leading Through AI Disruption",
    supportingDescription:
      "Translate AI potential into profit strategy, identify value leakage, and design transformation roadmaps aligned with growth, margins, and competitive positioning.",
    reality:
      "“You’re under pressure to ‘do something’ with AI — while ensuring it actually improves margins, growth, and strategic positioning.”",
    whatsAtStake: [
      "Margin erosion despite operational improvements",
      "AI investments without clear ROI",
      "Competitors shifting from products to platforms",
      "Board scrutiny on long-term defensibility",
    ],
    howWeHelp: [
      "Translate AI potential into board-level profit strategy",
      "Identify where profit pools are leaking or migrating",
      "Design self-funded transformation roadmaps",
      "Build multi-pattern advantage across cost, growth, and moats",
    ],
    typicalOutcomes: [
      "15–25% EBITDA uplift",
      "6–18 month payback on AI investments",
      "Clear platform or ecosystem end-game",
    ],
    ctaText: "Schedule Strategic Diagnostic",
  },
  {
    id: "boards-directors",
    anchor: "boards-directors",
    title: "Boards & Directors",
    positioning: "For Boards Demanding Clarity, Not AI Theater",
    supportingDescription:
      "Gain an independent business-first perspective on AI investments, capital allocation, governance, and long-term strategic defensibility.",
    reality:
      "“Management talks AI. Vendors sell hype. Shareholders expect results.”",
    whatsAtStake: [
      "Capital misallocation",
      "Long-term competitive erosion",
      "Poor linkage between AI spend and valuation",
      "Blind spots in ecosystem threats",
    ],
    howWeHelp: [
      "Independent, business-first AI strategy perspective",
      "Board-ready frameworks and value migration analysis",
      "Clear oversight of management AI initiatives",
      "Long-term moat and platform positioning",
    ],
    typicalOutcomes: [
      "Confident AI governance",
      "Sharper capital allocation decisions",
      "Stronger strategic oversight",
    ],
    ctaText: "Board-Level Diagnostic or Advisory Retainer",
  },
  {
    id: "private-equity-investors",
    anchor: "private-equity-investors",
    title: "Private Equity & Investors",
    positioning: "For Investors Focused on Value Creation, Not Experiments",
    supportingDescription:
      "Identify AI-driven value creation opportunities, develop repeatable portfolio playbooks, and improve visibility into EBITDA opportunities.",
    reality:
      "“You need AI to create measurable enterprise value — not another portfolio-wide experiment.”",
    whatsAtStake: [
      "Missed EBITDA upside",
      "Fragmented AI pilots across the portfolio",
      "Lack of repeatable value-creation playbooks",
      "Limited visibility into AI-driven competitive disruption",
    ],
    howWeHelp: [
      "Identify where AI creates real valuation uplift",
      "Design repeatable multi-pattern strategies",
      "Enable self-funded transformations",
      "Share pattern intelligence across the portfolio",
    ],
    typicalOutcomes: [
      "Portfolio-wide value creation visibility",
      "Repeatable AI value-creation playbooks",
      "Faster identification of EBITDA opportunities",
    ],
    ctaText: "Explore Portfolio Value Creation",
  },
  {
    id: "family-owned-enterprises",
    anchor: "family-owned-enterprises",
    title: "Family-Owned Enterprises",
    positioning: "For Owners Protecting Legacy While Building the Next Growth Engine",
    supportingDescription:
      "Modernize with strategic clarity while protecting core profit pools, ownership priorities, organizational culture, and long-term resilience.",
    reality:
      "“You’ve built something valuable. Now you need to modernize without sacrificing control, culture, or long-term resilience.”",
    whatsAtStake: [
      "Growth slowing across generations",
      "Digital disruption to established revenue streams",
      "Technology investments without strategic clarity",
      "Loss of competitive advantage over time",
    ],
    howWeHelp: [
      "Identify where AI can strengthen the existing business",
      "Build practical transformation roadmaps",
      "Protect core profit pools while creating new ones",
      "Develop long-term competitive and succession advantages",
    ],
    typicalOutcomes: [
      "Stronger and more resilient profit engines",
      "Clearer next-generation growth opportunities",
      "Self-funded modernization roadmap",
    ],
    ctaText: "Explore Your Next Growth Pattern",
  },
];

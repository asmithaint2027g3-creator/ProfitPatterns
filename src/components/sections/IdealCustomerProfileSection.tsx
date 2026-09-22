import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// 4-Part ICP Qualification Model
// ---------------------------------------------------------------------------
interface FrameworkPillar {
  id: string;
  step: string;
  name: string;
  question: string;
  criteria: string;
  detail: string;
}

const qualificationPillars: FrameworkPillar[] = [
  {
    id: "fit",
    step: "01",
    name: "FIT",
    question: "Does the business match our target operational profile?",
    criteria: "Established B2B service, agency, consultancy, or tech-enabled firm.",
    detail: "Post-validation stage with proven product/service, paying clients, verified operational history, and revenue of $500K to $10M+.",
  },
  {
    id: "pain",
    step: "02",
    name: "PAIN",
    question: "Is there a meaningful growth, profitability, or operational constraint?",
    criteria: "Revenue growing without profit, pipeline unpredictability, or founder drag.",
    detail: "Experiencing plateaued growth, lengthening sales cycles, siloed teams, or operational complexity outpacing margins.",
  },
  {
    id: "readiness",
    step: "03",
    name: "READINESS",
    question: "Is the organization actively seeking systemic solutions?",
    criteria: "Prepared to re-engineer workflows and adopt AI & data systems.",
    detail: "Focused on scalable, compounding business architecture rather than short-term marketing hacks or vanity traffic spikes.",
  },
  {
    id: "authority",
    step: "04",
    name: "AUTHORITY",
    question: "Is the visitor in a position to enact strategic change?",
    criteria: "Founder, CEO, Managing Director, CRO, or senior growth leader.",
    detail: "Direct executive mandate to influence pricing, offer architecture, go-to-market systems, and core operational processes.",
  },
];

// ---------------------------------------------------------------------------
// Core ICP Characteristics
// ---------------------------------------------------------------------------
const coreCharacteristics = [
  {
    category: "1. Business Stage",
    badge: "POST-VALIDATION",
    title: "Established Market Traction & Revenue",
    summary:
      "Businesses that have moved decisively past initial idea validation and have an established service offering, an active client base, and stable commercial momentum.",
    bullets: [
      "Beyond the early prototype or proof-of-concept phase",
      "Proven market appetite with recurring or ongoing engagements",
      "Typically generating $500K to $10M+ in annual revenue",
      "Focused on operational resilience and margin expansion rather than initial survival",
    ],
  },
  {
    category: "2. Growth Situation",
    badge: "GROWTH FRICTION",
    title: "Activity High, But Profit & Predictability Lagging",
    summary:
      "Businesses experiencing structural friction where more effort, headcount, or ad spend no longer produces proportional bottom-line results.",
    bullets: [
      "Growth has plateaued or revenue is volatile month-to-month",
      "Lead generation is not converting into enough qualified sales opportunities",
      "Sales cycles are becoming longer and deals harder to forecast",
      "Operations become increasingly complex and chaotic as revenue scales",
      "Marketing and sales teams are operating without unified strategic alignment",
      "Profit margins are compressing despite top-line revenue growth",
    ],
  },
  {
    category: "3. Decision-Maker",
    badge: "STRATEGIC MANDATE",
    title: "Executive Leadership With Real Authority",
    summary:
      "We collaborate directly with leaders who hold the authority to reshape business strategy, positioning, unit economics, and day-to-day operational models.",
    bullets: [
      "Founder / Business Owner",
      "Chief Executive Officer (CEO)",
      "Managing Director / General Manager",
      "Chief Revenue Officer (CRO) / Revenue Leader",
      "VP or Head of Growth / Strategy",
      "Leaders who can make structural decisions rather than superficial tool choices",
    ],
  },
  {
    category: "4. Business Mindset",
    badge: "SYSTEMS THINKING",
    title: "Data-Driven & Willing to Address Root Causes",
    summary:
      "Leaders who recognize that sustainable growth comes from disciplined systems, intelligent automation, and rigorous operational diagnosis.",
    bullets: [
      "Growth-oriented and hungry for competitive differentiation",
      "Open to data-driven decision-making and objective performance metrics",
      "Willing to inspect and re-engineer legacy processes",
      "Interested in practical, AI-enabled business infrastructure",
      "Committed to diagnosing underlying root causes before purchasing software",
      "Prioritizes durable enterprise value over quick-fix marketing hacks",
    ],
  },
];

// ---------------------------------------------------------------------------
// Pain Signals: "You May Be Our ICP If..."
// ---------------------------------------------------------------------------
interface PainSignal {
  headline: string;
  diagnostic: string;
}

const painSignals: PainSignal[] = [
  {
    headline: "“Revenue is growing, but profit isn't.”",
    diagnostic: "Gross margins are eroding due to inefficient delivery, scope creep, or operational friction that scales linearly with new client acquisition.",
  },
  {
    headline: "“Your team is busy, but growth still feels unpredictable.”",
    diagnostic: "High operational velocity is masking a lack of repeatable revenue infrastructure and clear pipeline predictability.",
  },
  {
    headline: "“You're generating leads, but too many are the wrong leads.”",
    diagnostic: "Marketing messaging and targeting lack qualification rigor, wasting expensive sales and consulting bandwidth on non-ideal prospects.",
  },
  {
    headline: "“Marketing and sales aren't operating from the same strategy.”",
    diagnostic: "Demand generation teams are evaluated on vanity volume while sales reps struggle with unqualified conversations and misaligned expectations.",
  },
  {
    headline: "“Your business depends too heavily on the founder.”",
    diagnostic: "The founder remains the essential linchpin for key sales closures, client delivery, or strategic problem-solving, bottlenecking scale.",
  },
  {
    headline: "“You have multiple offers, but no clear offer hierarchy.”",
    diagnostic: "A cluttered portfolio of custom bespoke proposals dilutes brand clarity, complicates delivery, and confuses prospective buyers.",
  },
  {
    headline: "“You've tried more leads, more ads, or more activity — but the underlying problem remains.”",
    diagnostic: "Pouring more volume into a constrained commercial system amplifies existing inefficiencies rather than solving structural bottlenecks.",
  },
  {
    headline: "“You know AI could improve your business, but you don't know where it should actually be applied.”",
    diagnostic: "Paralysis by tool proliferation: experimenting with isolated point solutions without a coherent business-led AI architecture.",
  },
  {
    headline: "“Your systems haven't kept pace with your growth.”",
    diagnostic: "Manual spreadsheets, disconnected SaaS apps, and ad-hoc handoffs create error-prone workflows and operational drag.",
  },
  {
    headline: "“You want predictable growth without simply adding more people, hours, or spending.”",
    diagnostic: "Seeking structural operating leverage: expanding output and gross margins through intelligent automation, AI pipelines, and systemic clarity.",
  },
];

// ---------------------------------------------------------------------------
// Buying / Readiness Signals
// ---------------------------------------------------------------------------
const readinessSignals = [
  "Revenue has reached a meaningful level ($500K+), but incremental scaling has become noticeably harder.",
  "Customer acquisition costs (CAC) are rising while sales conversion rates fluctuate unpredictably.",
  "Sales opportunities are difficult to qualify, price cleanly, and close without heavy custom discounting.",
  "The founder or senior partner is actively becoming the primary operational bottleneck.",
  "Departmental teams operate in disconnected functional silos without unified data visibility.",
  "The company is actively planning an AI or automation rollout, but lacks a disciplined, business-first roadmap.",
  "Executive leadership demands genuine visibility into unit economics, customer lifetime value, and margins.",
  "The organization wants to build repeatable, asset-like growth systems rather than relying on heroics.",
  "Leadership is committed to improving bottom-line profitability rather than just chasing vanity top-line numbers.",
];

// ---------------------------------------------------------------------------
// Poor-Fit Signals: "Probably Not a Fit If..."
// ---------------------------------------------------------------------------
const poorFitSignals = [
  "You are still trying to validate whether anyone wants your initial product or service (pre-traction / ideation stage).",
  "You are looking for a quick marketing trick, overnight viral gimmick, or short-term growth hack.",
  "You only want top-of-funnel lead volume without addressing qualification, positioning, or unit economics.",
  "You are unwilling to evaluate, challenge, or adapt existing internal operational workflows.",
  "You expect AI to magically solve a fundamentally undefined business problem without strategic input.",
  "You are searching for a generic, off-the-shelf, one-size-fits-all playbook without custom business analysis.",
];

// ---------------------------------------------------------------------------
// Interactive Diagnostic Assessment: "Is Your Business a ProfitPatterns Fit?"
// ---------------------------------------------------------------------------
interface DiagnosticQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    points: { fit: number; pain: number; readiness: number; authority: number };
  }[];
}

const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "business_type",
    title: "1. What type of business do you operate?",
    subtitle: "Select the operational model that best describes your core commercial engine.",
    options: [
      {
        label: "B2B Professional Services / Agency / Consultancy",
        description: "Delivering expertise, client retainers, high-value consulting, or managed services.",
        points: { fit: 3, pain: 2, readiness: 2, authority: 2 },
      },
      {
        label: "Tech-Enabled Services / B2B SaaS",
        description: "Hybrid software and human-in-the-loop services with recurring or contract revenue.",
        points: { fit: 3, pain: 2, readiness: 3, authority: 2 },
      },
      {
        label: "Specialized Advisory / Engineering / Architecture",
        description: "High-ticket bespoke contracts with deep domain expertise and complex project delivery.",
        points: { fit: 3, pain: 2, readiness: 2, authority: 2 },
      },
      {
        label: "Early-Stage Pre-Revenue Startup / Idea Phase",
        description: "Still building the initial prototype and seeking early product-market validation.",
        points: { fit: 0, pain: 1, readiness: 1, authority: 2 },
      },
    ],
  },
  {
    id: "business_stage",
    title: "2. What stage is your business currently in?",
    subtitle: "Understanding your current revenue traction helps determine where leverage sits.",
    options: [
      {
        label: "$500K – $2M (Established Traction)",
        description: "Proven core service with stable clients; ready to formalize predictable systems.",
        points: { fit: 3, pain: 3, readiness: 2, authority: 2 },
      },
      {
        label: "$2M – $10M+ (Growth & Scale)",
        description: "Substantial revenue, expanding team, experiencing operational complexity and margin pressure.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 3 },
      },
      {
        label: "$10M+ (Mature Mid-Market)",
        description: "Established market position seeking intelligent AI integration and workflow optimization.",
        points: { fit: 3, pain: 2, readiness: 3, authority: 3 },
      },
      {
        label: "Under $250K / Pre-Product Validation",
        description: "Early validation stage; primary focus is testing market demand and securing first clients.",
        points: { fit: 0, pain: 1, readiness: 0, authority: 1 },
      },
    ],
  },
  {
    id: "growth_challenge",
    title: "3. What is your biggest current growth challenge?",
    subtitle: "Where does the friction feel most acute in your business today?",
    options: [
      {
        label: "Revenue is growing, but profitability is flat or eroding",
        description: "Operating costs and overhead rise linearly with each new engagement.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 2 },
      },
      {
        label: "Unpredictable pipeline & unqualified lead generation",
        description: "Marketing and sales are misaligned, burning time on low-margin proposals.",
        points: { fit: 2, pain: 3, readiness: 2, authority: 2 },
      },
      {
        label: "Founder or key executives are the primary bottleneck",
        description: "Deals, delivery, and critical decisions stall whenever leadership is away.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 3 },
      },
      {
        label: "Disconnected tools & operational complexity slowing delivery",
        description: "Fragmented software and manual data silos prevent clean scalability.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 2 },
      },
    ],
  },
  {
    id: "ai_status",
    title: "4. Are you currently using AI or automation in your business?",
    subtitle: "Identify your organization's current maturity and openness toward modern technology.",
    options: [
      {
        label: "Actively seeking a structured, business-first AI roadmap",
        description: "We understand the strategic value and want high-impact, production-grade systems.",
        points: { fit: 3, pain: 2, readiness: 3, authority: 2 },
      },
      {
        label: "Basic ad-hoc experimentation (ChatGPT, isolated Zapier zaps)",
        description: "Our team uses point tools independently, but we lack cohesive workflow architecture.",
        points: { fit: 3, pain: 2, readiness: 2, authority: 2 },
      },
      {
        label: "Interested, but don't know where AI actually generates ROI",
        description: "Need clear strategic diagnosis to avoid wasting capital on irrelevant tech hype.",
        points: { fit: 3, pain: 3, readiness: 2, authority: 2 },
      },
      {
        label: "Not interested in modernizing systems or changing workflows",
        description: "Satisfied with existing manual operations and prefer traditional methods.",
        points: { fit: 0, pain: 0, readiness: 0, authority: 1 },
      },
    ],
  },
  {
    id: "founder_involvement",
    title: "5. How involved are you personally in day-to-day operations?",
    subtitle: "Evaluating executive operational leverage and system autonomy.",
    options: [
      {
        label: "Essential to almost every key sale, deliverable, and major decision",
        description: "The business cannot sustain momentum or close high-ticket deals without me.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 3 },
      },
      {
        label: "Heavily involved, but actively trying to delegate and build systems",
        description: "Transitioning toward leadership-led operations, but key processes remain informal.",
        points: { fit: 3, pain: 2, readiness: 3, authority: 3 },
      },
      {
        label: "Mostly strategic, with targeted operational and performance check-ins",
        description: "Delivery is largely systematized; focus is on strategic acceleration and margin expansion.",
        points: { fit: 2, pain: 1, readiness: 2, authority: 3 },
      },
    ],
  },
  {
    id: "desired_outcome",
    title: "6. What outcome are you primarily trying to achieve?",
    subtitle: "What does commercial success look like over the next 12 to 24 months?",
    options: [
      {
        label: "Predictable, scalable profit margins without linear headcount",
        description: "Decouple revenue growth from direct hours and expand enterprise value.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 3 },
      },
      {
        label: "Repeatable revenue engine with qualified pipeline alignment",
        description: "Tighten positioning, qualify prospects rigorously, and stabilize sales velocity.",
        points: { fit: 3, pain: 3, readiness: 3, authority: 2 },
      },
      {
        label: "Intelligent AI-powered operational advantage & workflow automation",
        description: "Embed custom intelligence into our service delivery to outperform industry peers.",
        points: { fit: 3, pain: 2, readiness: 3, authority: 3 },
      },
      {
        label: "Quick short-term lead spikes or temporary vanity marketing hacks",
        description: "Interested only in immediate ad clicks or volume without underlying system changes.",
        points: { fit: 0, pain: 0, readiness: 0, authority: 1 },
      },
    ],
  },
];

export function IdealCustomerProfileSection() {
  const [activePillarId, setActivePillarId] = useState<string>("fit");
  const [selectedPainIdx, setSelectedPainIdx] = useState<number | null>(null);

  // Diagnostic state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    const updated = { ...answers, [questionIdx]: optionIdx };
    setAnswers(updated);
    track("diagnostic_answer", { question: questionIdx, option: optionIdx });

    if (questionIdx < diagnosticQuestions.length - 1) {
      setCurrentQuestionIdx(questionIdx + 1);
    } else {
      setDiagnosticCompleted(true);
      track("diagnostic_completed", { totalAnswers: Object.keys(updated).length });
    }
  };

  const handleResetDiagnostic = () => {
    setAnswers({});
    setCurrentQuestionIdx(0);
    setDiagnosticCompleted(false);
  };

  // Calculate alignment score and pillar indicators
  const calculateResults = () => {
    let fitScore = 0;
    let painScore = 0;
    let readinessScore = 0;
    let authorityScore = 0;

    Object.entries(answers).forEach(([qIdx, optIdx]) => {
      const q = diagnosticQuestions[Number(qIdx)];
      if (q && q.options[optIdx]) {
        const pts = q.options[optIdx].points;
        fitScore += pts.fit;
        painScore += pts.pain;
        readinessScore += pts.readiness;
        authorityScore += pts.authority;
      }
    });

    const totalScore = fitScore + painScore + readinessScore + authorityScore;

    let alignmentCategory: "Strong alignment" | "Potential alignment" | "More context needed" =
      "Potential alignment";
    let statusTheme = "text-amber-700 border-amber-300 bg-amber-50";

    if (totalScore >= 38 && fitScore >= 9) {
      alignmentCategory = "Strong alignment";
      statusTheme = "text-emerald-800 border-emerald-300 bg-emerald-50";
    } else if (fitScore <= 4 || totalScore < 22) {
      alignmentCategory = "More context needed";
      statusTheme = "text-stone-700 border-stone-300 bg-stone-100";
    }

    return {
      fitScore,
      painScore,
      readinessScore,
      authorityScore,
      totalScore,
      alignmentCategory,
      statusTheme,
    };
  };

  const results = diagnosticCompleted ? calculateResults() : null;

  return (
    <section
      id="icp"
      aria-label="Ideal Customer Profile and Strategic Qualification Framework"
      className="relative overflow-hidden bg-background py-16 sm:py-24 border-y border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* 1. Header & Strategic Qualification Positioning                   */}
        {/* ================================================================= */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Target className="size-3.5" aria-hidden="true" />
            Ideal Customer Profile (ICP)
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Built For Growth-Stage Businesses Facing Strategic Friction.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
            ProfitPatterns is not built for every business. We partner specifically with
            founders, CEOs, and senior decision-makers of established service-based businesses,
            agencies, and consultancies who have achieved real market traction — but are now
            experiencing plateaus, unpredictable revenue, or operational drag.
          </p>
        </div>

        {/* Central Idea Callout Banner */}
        <div className="mt-8 rounded-lg border border-primary/25 bg-[#F9F7F2] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-primary">
                The Core Thesis
              </p>
              <p className="font-display text-lg sm:text-xl font-semibold text-foreground italic">
                “ProfitPatterns is not about doing more. It is about identifying the patterns that
                constrain growth, then building a clearer and more profitable system around them.”
              </p>
            </div>
            <div className="shrink-0">
              <Button asChild size="sm" variant="outline">
                <a href="#diagnostic-assessment">Take Fit Assessment</a>
              </Button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. Visual 4-Part ICP Qualification Framework (FIT → PAIN → READINESS → AUTHORITY) */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Qualification Model
              </p>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                The 4-Part Qualification Architecture
              </h3>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
              We use these four dimensions to ensure every engagement delivers defensible gross
              margin improvements and true operational leverage.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qualificationPillars.map((pillar, idx) => {
              const isSelected = activePillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    setActivePillarId(pillar.id);
                    track("icp_pillar_click", { pillar: pillar.id });
                  }}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-lg border p-6 text-left transition-all duration-300 cursor-pointer",
                    isSelected
                      ? "border-primary bg-card shadow-md -translate-y-1 ring-1 ring-primary/20"
                      : "border-border bg-card/70 hover:border-primary/40 hover:bg-card hover:-translate-y-0.5",
                  )}
                  aria-pressed={isSelected}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold tracking-[0.2em] text-primary">
                        STEP {pillar.step}
                      </span>
                      {idx < qualificationPillars.length - 1 && (
                        <ChevronRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1" />
                      )}
                    </div>
                    <h4 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {pillar.name}
                    </h4>
                    <p className="mt-2 font-display text-sm font-semibold text-foreground/90 leading-snug">
                      {pillar.question}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {pillar.detail}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/80 pt-3 text-[11px] font-medium text-primary">
                    Criteria: {pillar.criteria}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. Core ICP Characteristics (4 Cards)                             */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-20">
          <div className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Core Attributes
            </p>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
              What Defines an Ideal ProfitPatterns Client
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A high-fit partner exhibits specific markers across company lifecycle, operational
              bottlenecks, leadership profiles, and analytical mindset.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {coreCharacteristics.map((item) => (
              <div
                key={item.category}
                className="group flex flex-col justify-between rounded-lg border border-border bg-card p-7 shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      {item.category}
                    </span>
                    <span className="rounded bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-border/70 pt-4 text-xs text-foreground/90">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. Pain Signals: "You May Be Our ICP If..."                       */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-24 rounded-xl border border-border bg-[#FAF8F5] p-6 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Diagnostic Signals
            </p>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              You May Be Our ICP If…
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              These recurring patterns are what we see when high-performing businesses outgrow
              their initial ad-hoc operating systems. Click or hover any statement to view the
              underlying business constraint.
            </p>
          </div>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
            {painSignals.map((signal, idx) => {
              const isOpen = selectedPainIdx === idx;
              return (
                <div
                  key={signal.headline}
                  onClick={() => {
                    setSelectedPainIdx(isOpen ? null : idx);
                    track("pain_signal_toggle", { index: idx, state: !isOpen });
                  }}
                  className={cn(
                    "group flex flex-col justify-between rounded-lg border p-5 transition-all duration-200 cursor-pointer",
                    isOpen
                      ? "border-primary bg-card shadow-sm"
                      : "border-border/80 bg-card/80 hover:border-primary/40 hover:bg-card",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-display text-xs font-bold">
                        {idx + 1}
                      </span>
                      <p className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {signal.headline}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-primary font-semibold">
                      {isOpen ? "Hide" : "Inspect"}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mt-4 border-t border-border/80 pt-3 text-xs leading-relaxed text-muted-foreground animate-rise">
                      <span className="font-semibold text-primary uppercase tracking-wider block mb-1">
                        Underlying Structural Cause:
                      </span>
                      {signal.diagnostic}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. Buying / Readiness Signals vs. Poor-Fit Customers              */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-24 grid gap-8 lg:grid-cols-2">
          {/* Readiness Column */}
          <div className="flex flex-col justify-between rounded-xl border border-emerald-900/20 bg-emerald-950/[0.02] p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-700" />
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                  Readiness Indicators
                </span>
              </div>
              <h4 className="mt-3 font-display text-2xl font-bold text-foreground">
                When ProfitPatterns Becomes Relevant
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Key environmental triggers and leadership milestones that signify an organization
                is positioned to extract massive value from our engagement.
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/90">
                {readinessSignals.map((sig) => (
                  <li key={sig} className="flex items-start gap-3">
                    <span className="size-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span className="leading-relaxed">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-emerald-900/10 pt-4 text-xs text-emerald-800 font-medium">
              ✓ Ready for measurable margin improvement and scalable systems
            </div>
          </div>

          {/* Poor-Fit Column */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-[#F8F7F4]/60 p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-muted-foreground" />
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Constructive Boundary
                </span>
              </div>
              <h4 className="mt-3 font-display text-2xl font-bold text-foreground">
                Probably Not a Fit If…
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                We believe in total transparency. If your business is in one of these phases,
                ProfitPatterns is likely not the optimal partner for you at this time.
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-muted-foreground">
                {poorFitSignals.map((sig) => (
                  <li key={sig} className="flex items-start gap-3">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60 mt-2 shrink-0" />
                    <span className="leading-relaxed">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground italic">
              Respectful qualification preserves focus and ensures exceptional outcomes for active partners.
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. Interactive Diagnostic Component: "Is Your Business a Fit?"    */}
        {/* ================================================================= */}
        <div
          id="diagnostic-assessment"
          className="mt-16 sm:mt-24 rounded-2xl border border-primary/30 bg-card p-6 sm:p-10 shadow-lg"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-3.5" />
              Interactive Qualification Diagnostic
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Is Your Business a ProfitPatterns Fit?
            </h3>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Answer 6 strategic questions to evaluate your organizational alignment across Fit,
              Pain, Readiness, and Decision Authority. We do not provide false guarantees — only an
              honest architectural snapshot.
            </p>
          </div>

          {/* Progress Indicator */}
          {!diagnosticCompleted && (
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Question {currentQuestionIdx + 1} of {diagnosticQuestions.length}</span>
                <span>{Math.round(((currentQuestionIdx + 1) / diagnosticQuestions.length) * 100)}% Completed</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentQuestionIdx + 1) / diagnosticQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Active Question or Results Card */}
          {!diagnosticCompleted ? (
            <div className="mt-8 space-y-6 animate-rise">
              <div>
                <h4 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {diagnosticQuestions[currentQuestionIdx].title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {diagnosticQuestions[currentQuestionIdx].subtitle}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {diagnosticQuestions[currentQuestionIdx].options.map((option, optIdx) => {
                  const isSelected = answers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={cn(
                        "group flex flex-col justify-between rounded-lg border p-5 text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-primary bg-secondary/80 ring-1 ring-primary/40 shadow-xs"
                          : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30",
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {option.label}
                          </span>
                          <span className="size-4 rounded-full border border-primary/40 flex items-center justify-center shrink-0 ml-2">
                            {isSelected && <span className="size-2 rounded-full bg-primary" />}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back button if past question 0 */}
              {currentQuestionIdx > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    ← Previous Question
                  </button>
                  <span className="text-xs text-muted-foreground">
                    Click any option to proceed
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Results Snapshot */
            results && (
              <div className="mt-8 rounded-xl border border-border bg-[#FAF9F5] p-6 sm:p-8 animate-rise">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      ICP Fit Snapshot
                    </span>
                    <h4 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                      Diagnostic Assessment Result
                    </h4>
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider",
                      results.statusTheme,
                    )}
                  >
                    <Activity className="size-3.5" />
                    {results.alignmentCategory}
                  </div>
                </div>

                {/* 4-Pillar Score Cards */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Business Fit
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      {results.fitScore >= 8 ? "Strong Fit" : results.fitScore >= 5 ? "Moderate Fit" : "Early Stage"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {results.fitScore >= 8 ? "Ideal B2B Service Traction" : "Developing Commercial Model"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Growth Pain
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      {results.painScore >= 8 ? "High Urgency" : results.painScore >= 4 ? "Identified Friction" : "Low Pain"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {results.painScore >= 8 ? "Critical Scale Bottlenecks" : "Moderate Operational Drag"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Readiness & Mindset
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      {results.readinessScore >= 8 ? "Systems Ready" : results.readinessScore >= 4 ? "Exploring AI" : "Unprepared"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {results.readinessScore >= 8 ? "Prepared to Re-engineer" : "Needs Initial Education"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Decision Mandate
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      {results.authorityScore >= 8 ? "Executive Authority" : "Leadership Influence"}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Direct strategic mandate to enforce changes
                    </p>
                  </div>
                </div>

                {/* Qualitative Narrative */}
                <div className="mt-6 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-foreground/90">
                  <span className="font-semibold text-primary block mb-1 font-display text-xs uppercase tracking-wider">
                    Diagnostic Analysis:
                  </span>
                  {results.alignmentCategory === "Strong alignment" ? (
                    <p>
                      Your business profile matches the exact archetype ProfitPatterns was built to
                      support. You have established commercial traction and executive authority, but
                      are experiencing acute operational drag, founder bottlenecks, or margin
                      compression. Implementing a business-first AI and system architecture can unlock
                      predictable growth without linear payroll expansion.
                    </p>
                  ) : results.alignmentCategory === "Potential alignment" ? (
                    <p>
                      Your business demonstrates clear potential for strategic leverage. While some
                      areas are ready for immediate systems optimization, others may require
                      tighter offer positioning or internal consensus before deploying comprehensive
                      automation pipelines.
                    </p>
                  ) : (
                    <p>
                      Based on your responses, your organization may still be in the early validation
                      or exploratory phase. We recommend first solidifying your core offer and
                      confirming repeatable client demand before investing in heavy operational AI
                      infrastructure.
                    </p>
                  )}
                </div>

                {/* Diagnostic CTA Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={handleResetDiagnostic}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    Retake Assessment
                  </button>

                  <div className="flex items-center gap-3">
                    <Button asChild size="sm" variant="primary">
                      <Link
                        to="/contact"
                        onClick={() =>
                          track("cta_click", {
                            location: "icp_diagnostic",
                            alignment: results.alignmentCategory,
                          })
                        }
                      >
                        Explore Your Growth Pattern
                        <ArrowRight className="size-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* ================================================================= */}
        {/* 7. Closing Executive CTA Section                                   */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-24 rounded-2xl border border-primary/40 bg-[#1A1A1A] p-8 sm:p-12 lg:p-14 text-white shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#C4B296]">
              Next Strategic Step
            </span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Recognize Your Business?
            </h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-stone-300">
              If these challenges sound familiar, the next step is understanding where the real
              constraint sits — and what to fix first.
            </p>

            <div className="mt-6 border-y border-stone-700/60 py-4">
              <p className="font-display text-sm sm:text-base italic text-[#E5D8C4] max-w-2xl mx-auto">
                “ProfitPatterns is not about doing more. It is about identifying the patterns that
                constrain growth, then building a clearer and more profitable system around them.”
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-[#C4B296] text-[#1A1A1A] hover:bg-[#D4C5AC] font-bold">
                <Link
                  to="/contact"
                  onClick={() => track("cta_click", { location: "icp_footer", cta: "explore_growth_pattern" })}
                >
                  Explore Your Growth Pattern
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <WhatsAppCTA location="icp_footer" size="lg" variant="outline" className="border-stone-600 text-white hover:bg-stone-800" />
            </div>

            <p className="mt-5 text-xs text-stone-400">
              Direct consultation with a strategic partner. No junior sales reps, generic pitches, or forced software stacks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

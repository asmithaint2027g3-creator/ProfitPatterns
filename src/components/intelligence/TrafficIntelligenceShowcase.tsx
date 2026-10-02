// src/components/intelligence/TrafficIntelligenceShowcase.tsx
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  Fingerprint,
  Globe,
  Layers,
  LineChart,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

import { useDigitalPresenceIntelligence } from "@/components/intelligence/IntelligenceContext";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const INTELLIGENCE_PILLARS = [
  {
    id: "session",
    title: "Session Intelligence",
    icon: Radio,
    tagline: "Tracks individual user sessions & micro-trajectories",
    insights: [
      "Real-time entry / exit page detection",
      "Dynamic navigation breadcrumb flow",
      "Per-page and cumulative dwell duration",
      "Algorithmic bounce propensity scoring",
    ],
    useCases: [
      "UX & friction point optimization",
      "Multi-step conversion funnel analysis",
      "Dynamic in-session personalization",
    ],
    metricLabel: "Active Telemetry",
    metricValue: "Sub-second",
  },
  {
    id: "traffic",
    title: "Traffic Intelligence",
    icon: TrendingUp,
    tagline: "Monitors inbound traffic vectors & campaign attribution",
    insights: [
      "Organic Search vs Paid Advertising vs LinkedIn vs Social",
      "Multi-touch campaign attribution (First & Last Touch)",
      "High-converting keyword & channel clustering",
      "Channel ROI weight calculation",
    ],
    useCases: [
      "Marketing capital allocation & ROI maximization",
      "Granular channel performance benchmarking",
      "High-value executive audience segmentation",
    ],
    metricLabel: "Attribution Precision",
    metricValue: "99.4%",
  },
  {
    id: "geo",
    title: "Geo Intelligence",
    icon: Globe,
    tagline: "Identifies precise regional demand & localized engagement",
    insights: [
      "Country, regional market tier, and city identification",
      "Cultural & regional EBITDA preference modeling",
      "Multi-jurisdictional compliance policy mapping",
      "Localized currency & value framing",
    ],
    useCases: [
      "Geo-targeted consulting campaigns",
      "Localized case studies & regional proof points",
      "Automated GDPR & CCPA privacy adherence",
    ],
    metricLabel: "Global Coverage",
    metricValue: "190+ Countries",
  },
  {
    id: "timezone",
    title: "Time Zone Intelligence",
    icon: Clock,
    tagline: "Captures time-based executive activity & peak windows",
    insights: [
      "Executive peak decision-making hours detection",
      "Regional time-based behavioral patterns",
      "Synchronized Global Advisory Hub SLA tracking",
      "Day-phase contextual engagement",
    ],
    useCases: [
      "Optimizing executive support & advisory availability",
      "Scheduling diagnostic consultations seamlessly",
      "Global 24/7 autonomous intake routing",
    ],
    metricLabel: "Active Advisory Desks",
    metricValue: "5 Global Hubs",
  },
  {
    id: "ip",
    title: "IP Intelligence",
    icon: Fingerprint,
    tagline: "Deeper network profiling, B2B targeting & threat shield",
    insights: [
      "Enterprise ISP & Corporate network identification",
      "Fortune 500 / Private Equity network intent detection",
      "Automated bot, scraper & fraud risk scoring",
      "Repeat visit velocity & session depth indexing",
    ],
    useCases: [
      "Account-Based Marketing (ABM) for enterprise CXOs",
      "Real-time fraud defense & threat mitigation",
      "Fast-tracked VIP routing to Senior Partners",
    ],
    metricLabel: "Verification Rate",
    metricValue: "< 0.05% False Positive",
  },
];

const SYNERGY_LAYERS = [
  {
    id: "session_traffic",
    title: "Session + Traffic",
    subtitle: "Conversion Funnel Clarity",
    icon: LineChart,
    description:
      "Combining inbound traffic origin with live micro-navigation provides complete clarity into where prospective clients drop off, which campaigns deliver real executive intent, and when to trigger high-converting diagnostic offers.",
    keyBenefit: "4.2x higher conversion from paid channels to diagnostic submission.",
    tags: ["Funnel Visualization", "Attribution Match", "Drop-Off Mitigation"],
  },
  {
    id: "geo_timezone",
    title: "Geo + Time Zone",
    subtitle: "Regional Engagement Optimization",
    icon: Globe,
    description:
      "Aligning localized regional demand with real-time business hours ensures prospects in London, New York, Singapore, or Dubai receive region-specific financial benchmarks and immediate connection to an active advisory desk.",
    keyBenefit: "< 15-minute response SLA across all major financial capitals.",
    tags: ["Time-Aware Routing", "Localized EBITDA Stats", "Compliance Sync"],
  },
  {
    id: "ip_traffic",
    title: "IP + Traffic",
    subtitle: "Fraud Detection + Enterprise Targeting",
    icon: ShieldCheck,
    description:
      "Cross-referencing corporate network signatures against inbound campaign links automatically filters out non-human web crawlers and instantly alerts Partners when a Tier-1 enterprise or PE firm lands on the platform.",
    keyBenefit: "100% protection against ad fraud with automated B2B VIP routing.",
    tags: ["Enterprise Account Detection", "Bot Shield", "High-Touch Intake"],
  },
  {
    id: "combined",
    title: "Combined Layering",
    subtitle: "Predictive Intelligence for Digital Presence",
    icon: Brain,
    description:
      "When all 5 pillars are synthesized, the digital presence becomes predictive. The platform anticipates executive intent, personalizes strategy blueprints, schedules global advisory capacity, and secures confidential data seamlessly.",
    keyBenefit: "Autonomous, personalized digital experience engineered for boardroom conversion.",
    tags: ["Predictive Personalization", "Boardroom Readiness", "360° Lead Intelligence"],
  },
];

export function TrafficIntelligenceShowcase() {
  const { snapshot, setConsoleOpen } = useDigitalPresenceIntelligence();
  const [activePillarId, setActivePillarId] = useState("session");
  const [activeSynergyId, setActiveSynergyId] = useState("session_traffic");

  const activePillar = INTELLIGENCE_PILLARS.find((p) => p.id === activePillarId) ?? INTELLIGENCE_PILLARS[0]!;
  const activeSynergy = SYNERGY_LAYERS.find((s) => s.id === activeSynergyId) ?? SYNERGY_LAYERS[0]!;
  const PillarIcon = activePillar.icon;
  const SynergyIcon = activeSynergy.icon;

  return (
    <section className="relative border-b border-border bg-surface/40 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-3.5" />
            <span>Digital Presence Intelligence</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Traffic & Experience Intelligence Engineered for <span className="text-primary italic font-normal">Conversion.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            ProfitPatterns integrates deep real-time session tracking, multi-touch attribution, localized geo-intelligence, and corporate network profiling into a unified predictive digital presence.
          </p>
        </div>

        {/* Part 1: Interactive 5 Pillars */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Pillar Architecture</span>
              <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                The 5 Dimensions of Traffic & Session Intelligence
              </h3>
            </div>

            <Button
              onClick={() => setConsoleOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Activity className="size-3.5" />
              <span>Launch Live Telemetry Console</span>
            </Button>
          </div>

          {/* Pillar Selector Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {INTELLIGENCE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activePillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={cn(
                    "flex flex-col items-start rounded-lg border p-3.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                      : "border-border bg-background hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <Icon className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  <span className="mt-2 font-display text-xs sm:text-sm font-bold text-foreground">
                    {pillar.title.replace(" Intelligence", "")}
                  </span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">{pillar.metricLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Detail Visualizer */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center rounded-lg border border-border/80 bg-secondary/20 p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <PillarIcon className="size-6" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground">{activePillar.title}</h4>
                  <p className="text-xs text-muted-foreground">{activePillar.tagline}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                {/* Insights Box */}
                <div className="rounded-lg border border-border bg-background p-4 space-y-2.5">
                  <span className="font-bold text-primary uppercase tracking-wider text-[11px] block">
                    Core Insights Extracted
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {activePillar.insights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases Box */}
                <div className="rounded-lg border border-border bg-background p-4 space-y-2.5">
                  <span className="font-bold text-foreground uppercase tracking-wider text-[11px] block">
                    Strategic Use Cases
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {activePillar.useCases.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ArrowRight className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Live Client Comparison Card */}
            <div className="lg:col-span-5 rounded-lg border border-primary/30 bg-card p-5 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="font-bold text-foreground">Your Live Telemetry Snapshot</span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  Active in Browser
                </span>
              </div>

              {activePillar.id === "session" && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Dwell Time:</span>
                    <span className="font-bold text-foreground">{snapshot.session.dwellTimeSeconds} seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Funnel Stage:</span>
                    <span className="font-bold text-primary">{snapshot.session.funnelStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bounce Propensity:</span>
                    <span className="font-bold text-emerald-600">{snapshot.session.bounceRisk} Risk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breadcrumbs Tracked:</span>
                    <span className="font-bold text-foreground">{snapshot.session.navigationFlow.length} steps</span>
                  </div>
                </div>
              )}

              {activePillar.id === "traffic" && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classified Origin:</span>
                    <span className="font-bold text-primary">{snapshot.traffic.trafficSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attribution Channel:</span>
                    <span className="font-bold text-foreground">{snapshot.traffic.referrerDomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Channel ROI Weight:</span>
                    <span className="font-bold text-emerald-600">{snapshot.traffic.channelScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ad Tag / Click ID:</span>
                    <span className="font-bold text-foreground">{snapshot.traffic.clickId || "Organic Direct"}</span>
                  </div>
                </div>
              )}

              {activePillar.id === "geo" && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Detected City & Flag:</span>
                    <span className="font-bold text-foreground">
                      {snapshot.geo.flag} {snapshot.geo.city}, {snapshot.geo.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regional Market Tier:</span>
                    <span className="font-bold text-primary">{snapshot.geo.regionalMarket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Localized Currency:</span>
                    <span className="font-bold text-foreground">{snapshot.geo.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Policy:</span>
                    <span className="font-bold text-emerald-600">{snapshot.geo.complianceMode}</span>
                  </div>
                </div>
              )}

              {activePillar.id === "timezone" && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local Time & Offset:</span>
                    <span className="font-bold text-foreground">
                      {snapshot.timezone.localTime} ({snapshot.timezone.utcOffset})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Decision Phase:</span>
                    <span className="font-bold text-primary">{snapshot.timezone.dayPhase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Strategy Desk:</span>
                    <span className="font-bold text-emerald-600">{snapshot.timezone.activeDesk.deskName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direct Response SLA:</span>
                    <span className="font-bold text-foreground">{snapshot.timezone.activeDesk.responseTime}</span>
                  </div>
                </div>
              )}

              {activePillar.id === "ip" && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Provider:</span>
                    <span className="font-bold text-foreground">{snapshot.ip.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Class:</span>
                    <span className="font-bold text-primary">{snapshot.ip.networkType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bot / Fraud Risk:</span>
                    <span className="font-bold text-emerald-600">{(snapshot.ip.fraudRiskScore * 100).toFixed(0)}% (Clean)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Rating:</span>
                    <span className="font-bold text-foreground">{snapshot.ip.securityTier}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Part 2: ⚡ How They Work Together (4 Synergy Layers) */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Layered Multiplier</span>
            <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              ⚡ How They Work Together
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Layering intelligence transforms raw data into boardroom-ready predictive outcomes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SYNERGY_LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <Icon className="size-3.5" />
                      <span>{layer.title}</span>
                    </div>

                    <h4 className="mt-4 font-display text-lg font-bold text-foreground">{layer.subtitle}</h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{layer.description}</p>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <div className="rounded bg-secondary/50 p-2.5 text-[11px] font-semibold text-primary">
                      {layer.keyBenefit}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {layer.tags.map((tag, i) => (
                        <span key={i} className="rounded bg-background px-2 py-0.5 border border-border text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-xl border border-primary/30 bg-gradient-to-r from-card via-secondary/40 to-card p-8 text-center sm:p-10 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Want to Deploy This Intelligence Architecture in Your Firm?
          </h3>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            ProfitPatterns engineers customized traffic intelligence pipelines, deterministic AI workflows, and unit economics diagnostics tailored to your P&L.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="primary">
              <Link to="/contact">
                Schedule AI Profit Diagnostic
              </Link>
            </Button>
            <Button
              onClick={() => setConsoleOpen(true)}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Explore Live Telemetry Console</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

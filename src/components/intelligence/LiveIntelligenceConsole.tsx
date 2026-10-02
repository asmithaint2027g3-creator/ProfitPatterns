// src/components/intelligence/LiveIntelligenceConsole.tsx
import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Eye,
  Fingerprint,
  Flame,
  Globe,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

import { useDigitalPresenceIntelligence } from "@/components/intelligence/IntelligenceContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SimulationPreset } from "@/utils/intelligence";

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function LiveIntelligenceConsole() {
  const {
    snapshot,
    consoleOpen,
    setConsoleOpen,
    activeSimulation,
    applySimulation,
  } = useDigitalPresenceIntelligence();

  const [activeTab, setActiveTab] = useState<"pillars" | "synergy" | "simulator" | "telemetry">("pillars");
  const [copied, setCopied] = useState(false);

  const { session, traffic, geo, timezone, ip, synergy, isSimulated, simulatedPersonaName } = snapshot;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 1. Floating Telemetry Trigger Badge (Bottom Left) */}
      {!consoleOpen && (
        <div className="fixed bottom-20 left-4 z-40 hidden md:block">
          <button
            onClick={() => setConsoleOpen(true)}
            className={cn(
              "group flex items-center gap-2.5 rounded-full border border-primary/30 bg-card/95 px-3.5 py-2 text-xs text-foreground shadow-lg backdrop-blur-md transition-all hover:border-primary hover:shadow-xl",
              isSimulated && "ring-2 ring-primary/40 border-primary"
            )}
            title="Open Live Traffic & Session Intelligence Console"
          >
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="size-3.5 text-primary" />
              <span>Traffic & Session Intelligence</span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-border pl-2 text-muted-foreground font-mono text-[11px]">
              <span>{geo.flag}</span>
              <span>{formatSeconds(session.dwellTimeSeconds)}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                {synergy.combinedLayering.predictivePersonalizationScore}% Intent
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Full Intelligence Drawer / Modal */}
      {consoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Activity className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
                      Digital Presence & Traffic Intelligence Engine
                    </h2>
                    {isSimulated ? (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary">
                        SIMULATED SCENARIO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE CLIENT TELEMETRY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multi-dimensional profiling across Session, Traffic, Geo, Time Zone, and IP Intelligence with real-time predictive layering.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleOpen(false)}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-border bg-secondary/40 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab("pillars")}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                  activeTab === "pillars"
                    ? "border-primary text-primary bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers className="size-4" />
                <span>5 Intelligence Pillars</span>
              </button>

              <button
                onClick={() => setActiveTab("synergy")}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                  activeTab === "synergy"
                    ? "border-primary text-primary bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Zap className="size-4" />
                <span>⚡ How They Work Together</span>
              </button>

              <button
                onClick={() => setActiveTab("simulator")}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                  activeTab === "simulator"
                    ? "border-primary text-primary bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Sliders className="size-4" />
                <span>Persona & Traffic Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab("telemetry")}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                  activeTab === "telemetry"
                    ? "border-primary text-primary bg-background/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="size-4" />
                <span>Live Event Stream</span>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: 5 INTELLIGENCE PILLARS */}
              {activeTab === "pillars" && (
                <div className="space-y-6">
                  {/* Top Level Summary Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* 1. Session Pillar */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session</span>
                        <Radio className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-foreground">{formatSeconds(session.dwellTimeSeconds)}</span>
                        <span className="text-xs text-muted-foreground">Dwell</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>Stage:</span>
                        <span className="font-medium text-foreground">{session.funnelStage.split(". ")[1]}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Bounce Risk:</span>
                        <span className={cn("font-medium", session.bounceRisk === "Low" ? "text-emerald-600" : "text-amber-600")}>
                          {session.bounceRisk}
                        </span>
                      </div>
                    </div>

                    {/* 2. Traffic Pillar */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Traffic</span>
                        <TrendingUp className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-foreground">{traffic.channelScore}%</span>
                        <span className="text-xs text-muted-foreground">ROI Weight</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>Source:</span>
                        <span className="font-medium text-foreground truncate max-w-[90px]">{traffic.trafficSource}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Medium:</span>
                        <span className="font-medium text-foreground">{traffic.medium}</span>
                      </div>
                    </div>

                    {/* 3. Geo Pillar */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Geo</span>
                        <Globe className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xl">{geo.flag}</span>
                        <span className="font-display font-bold text-foreground truncate">{geo.city}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>Region:</span>
                        <span className="font-medium text-foreground">{geo.countryCode}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Currency:</span>
                        <span className="font-medium text-foreground">{geo.currency.split(" ")[0]}</span>
                      </div>
                    </div>

                    {/* 4. Time Zone Pillar */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time Zone</span>
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-foreground">{timezone.localTime}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>Offset:</span>
                        <span className="font-medium text-foreground">{timezone.utcOffset}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Desk:</span>
                        <span className="font-medium text-emerald-600">{timezone.activeDesk.deskName.split(" ")[0]}</span>
                      </div>
                    </div>

                    {/* 5. IP Pillar */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP Profile</span>
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-mono text-xl font-bold text-foreground">{(ip.fraudRiskScore * 100).toFixed(0)}%</span>
                        <span className="text-xs text-muted-foreground">Risk</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>Type:</span>
                        <span className="font-medium text-foreground">{ip.networkType.split(" ")[0]}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Visits:</span>
                        <span className="font-medium text-foreground">#{ip.repeatVisitVelocity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deep Pillar Breakdown Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Session Intelligence Detail Box */}
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <Radio className="size-4 text-primary" />
                        <span>1. Session Intelligence Details</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tracks individual navigation trajectories, entry/exit points, active dwell duration, and bounce propensity.
                      </p>

                      <div className="mt-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Entry Landing Point:</span>
                          <span className="font-mono font-medium text-foreground">{session.entryPage}</span>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Current Active Page:</span>
                          <span className="font-mono font-medium text-foreground">{session.currentPage}</span>
                        </div>
                        <div className="rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground block mb-1">Navigation Flow History:</span>
                          <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                            {session.navigationFlow.map((step, idx) => (
                              <React.Fragment key={idx}>
                                <span className="rounded bg-background px-1.5 py-0.5 border border-border">
                                  {step}
                                </span>
                                {idx < session.navigationFlow.length - 1 && (
                                  <span className="text-muted-foreground">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="rounded border border-border p-2">
                            <span className="text-[10px] text-muted-foreground block">Page Dwell</span>
                            <span className="font-mono font-bold text-foreground">{session.dwellTimeSeconds}s</span>
                          </div>
                          <div className="rounded border border-border p-2">
                            <span className="text-[10px] text-muted-foreground block">Session Time</span>
                            <span className="font-mono font-bold text-foreground">{session.sessionDwellSeconds}s</span>
                          </div>
                          <div className="rounded border border-border p-2">
                            <span className="text-[10px] text-muted-foreground block">Interactions</span>
                            <span className="font-mono font-bold text-foreground">{session.interactionCount} events</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Traffic Intelligence Detail Box */}
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <TrendingUp className="size-4 text-primary" />
                        <span>2. Traffic Intelligence & Attribution</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Monitors inbound traffic vectors, marketing attribution channels, and campaign ROI tracking.
                      </p>

                      <div className="mt-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Classified Vector:</span>
                          <span className="font-semibold text-primary">{traffic.trafficSource}</span>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Attribution Source / Referrer:</span>
                          <span className="font-medium text-foreground">{traffic.referrerDomain}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Campaign:</span>
                            <span className="font-mono text-[11px] font-medium text-foreground">{traffic.campaign}</span>
                          </div>
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Medium / Term:</span>
                            <span className="font-mono text-[11px] font-medium text-foreground">{traffic.medium} / {traffic.term || "n/a"}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Click ID / Ad Tag:</span>
                          <span className="font-mono text-[11px] font-medium text-foreground">{traffic.clickId || "Direct Inbound"}</span>
                        </div>
                        <div className="rounded border border-border p-2 text-xs">
                          <span className="text-[10px] text-muted-foreground block">First Touch Attribution:</span>
                          <span className="font-medium text-foreground">
                            {traffic.firstTouchAttribution.source} ({traffic.firstTouchAttribution.landingPage})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Geo & Time Zone Detail Box */}
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <Globe className="size-4 text-primary" />
                        <span>3. Geo & Time Zone Intelligence</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Identifies regional demand, localized market preferences, peak operational windows, and compliance policies.
                      </p>

                      <div className="mt-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Detected Location:</span>
                          <span className="font-semibold text-foreground">
                            {geo.flag} {geo.city}, {geo.region}, {geo.country}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Market Tier:</span>
                            <span className="font-medium text-foreground">{geo.regionalMarket}</span>
                          </div>
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Compliance Regime:</span>
                            <span className="font-medium text-emerald-600">{geo.complianceMode}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Local Clock & Phase:</span>
                          <span className="font-mono font-medium text-foreground">
                            {timezone.localTime} ({timezone.utcOffset}) • {timezone.dayPhase}
                          </span>
                        </div>
                        <div className="rounded border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block mb-1">ProfitPatterns Advisory Hub Sync:</span>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            {timezone.advisoryDesks.slice(0, 4).map((desk, i) => (
                              <div key={i} className="flex items-center justify-between rounded bg-secondary/40 px-2 py-1">
                                <span className="truncate">{desk.location.split(",")[0]}:</span>
                                <span className="font-semibold text-emerald-600 text-[10px]">{desk.responseTime}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IP & Corporate Profile Detail Box */}
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <Fingerprint className="size-4 text-primary" />
                        <span>4. IP & Security Intelligence</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Deeper network profiling, ISP classification, fraud defense scoring, and enterprise B2B intent detection.
                      </p>

                      <div className="mt-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Masked IP Address:</span>
                          <span className="font-mono font-medium text-foreground">{ip.maskedIp}</span>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Carrier / ISP Provider:</span>
                          <span className="font-medium text-foreground">{ip.isp}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Corporate Intent:</span>
                            <span className="font-semibold text-primary">{ip.isCorporate ? "High Enterprise Intent" : "Standard Inbound"}</span>
                          </div>
                          <div className="rounded bg-secondary/50 p-2">
                            <span className="text-[10px] text-muted-foreground block">Security Verification:</span>
                            <span className="font-semibold text-emerald-600">{ip.fraudStatus}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded bg-secondary/50 p-2">
                          <span className="text-muted-foreground">Risk Velocity Index:</span>
                          <span className="font-mono font-medium text-foreground">
                            Score {(ip.fraudRiskScore * 100).toFixed(1)} / 100 (Clean)
                          </span>
                        </div>
                        <div className="rounded border border-border p-2">
                          <span className="text-[10px] text-muted-foreground block">Enterprise Profile:</span>
                          <span className="font-medium text-foreground">{ip.corporateEntity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ⚡ HOW THEY WORK TOGETHER */}
              {activeTab === "synergy" && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-xs">
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                      <Zap className="size-4" />
                      <span>⚡ The Multi-Layer Synergy Architecture</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Individual data points provide visibility; layering them produces decisive strategic intelligence.
                      Here is how ProfitPatterns synthesizes these 5 dimensions to maximize conversion, security, and enterprise advisory outcomes.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Layer 1: Session + Traffic */}
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          <Radio className="size-3.5" /> + <TrendingUp className="size-3.5" />
                          <span>Session + Traffic</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">
                          {synergy.sessionPlusTraffic.conversionFunnelScore}% Funnel Clarity
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-base font-bold text-foreground">
                        {synergy.sessionPlusTraffic.subtitle}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Maps inbound traffic origin directly against active navigation flow to isolate friction points and predict high-margin conversion likelihood.
                      </p>

                      <div className="mt-4 space-y-2 rounded bg-secondary/50 p-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Journey Stage:</span>
                          <span className="font-medium text-foreground">{synergy.sessionPlusTraffic.funnelStageSummary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Drop-off / Bounce Propensity:</span>
                          <span className="font-medium text-emerald-600">{synergy.sessionPlusTraffic.dropoffRisk}</span>
                        </div>
                        <div className="border-t border-border/50 pt-2">
                          <span className="text-[10px] text-muted-foreground block">Dynamic CTA Recommendation:</span>
                          <span className="font-semibold text-primary">{synergy.sessionPlusTraffic.recommendedCTA}</span>
                        </div>
                      </div>
                    </div>

                    {/* Layer 2: Geo + Time Zone */}
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          <Globe className="size-3.5" /> + <Clock className="size-3.5" />
                          <span>Geo + Time Zone</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">
                          {timezone.activeDesk.status}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-base font-bold text-foreground">
                        {synergy.geoPlusTimeZone.subtitle}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Aligns engagement with regional business hours, localized EBITDA benchmarks, and immediate partner availability.
                      </p>

                      <div className="mt-4 space-y-2 rounded bg-secondary/50 p-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Regional Market Context:</span>
                          <span className="font-medium text-foreground">{synergy.geoPlusTimeZone.regionalMarketSummary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Advisory Desk SLA:</span>
                          <span className="font-medium text-foreground">{synergy.geoPlusTimeZone.localizedOfficeHours}</span>
                        </div>
                        <div className="border-t border-border/50 pt-2">
                          <span className="text-[10px] text-muted-foreground block">Financial Benchmark Framing:</span>
                          <span className="font-semibold text-primary">{synergy.geoPlusTimeZone.localizedValueBenchmark}</span>
                        </div>
                      </div>
                    </div>

                    {/* Layer 3: IP + Traffic */}
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          <Fingerprint className="size-3.5" /> + <TrendingUp className="size-3.5" />
                          <span>IP + Traffic</span>
                        </div>
                        <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                          {synergy.ipPlusTraffic.enterprisePriorityLevel}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-base font-bold text-foreground">
                        {synergy.ipPlusTraffic.subtitle}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cross-references network infrastructure against traffic channels to filter non-human scrapers while prioritizing Fortune 500 & PE leads.
                      </p>

                      <div className="mt-4 space-y-2 rounded bg-secondary/50 p-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shield Defense Verdict:</span>
                          <span className="font-medium text-emerald-600">{synergy.ipPlusTraffic.fraudDefenseStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Enterprise Routing:</span>
                          <span className="font-medium text-foreground">{synergy.ipPlusTraffic.b2bTargetingVerdict}</span>
                        </div>
                      </div>
                    </div>

                    {/* Layer 4: Combined Layering (Master Predictive Engine) */}
                    <div className="rounded-lg border border-primary/40 bg-gradient-to-br from-card to-primary/5 p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                          <Brain className="size-3.5" />
                          <span>Combined Layering</span>
                        </div>
                        <span className="text-xs font-bold text-primary">
                          {synergy.combinedLayering.predictivePersonalizationScore}% Synergy Score
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-base font-bold text-foreground">
                        {synergy.combinedLayering.subtitle}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Holistic real-time synthesis that auto-personalizes messaging, prioritizes partner consultation queues, and guarantees enterprise compliance.
                      </p>

                      <div className="mt-4 space-y-2 rounded bg-background/80 p-3 text-xs border border-primary/20">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Executive Profile Synthesis:</span>
                          <span className="font-medium text-foreground">{synergy.combinedLayering.executiveSummary}</span>
                        </div>
                        <div className="border-t border-border/50 pt-2">
                          <span className="text-[10px] text-muted-foreground block">Prescribed Next Strategic Action:</span>
                          <span className="font-bold text-primary">{synergy.combinedLayering.tailoredStrategyRecommendation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERSONA & AUDIENCE SIMULATOR */}
              {activeTab === "simulator" && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                      <Sliders className="size-4 text-primary" />
                      <span>Interactive Traffic & Persona Simulator</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Test how ProfitPatterns' intelligence engine dynamically classifies different global visitors, inbound campaign types, timezones, and enterprise tiers.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Persona 1: London PE */}
                      <button
                        onClick={() => applySimulation("london_pe")}
                        className={cn(
                          "flex flex-col justify-between rounded-lg border p-4 text-left transition-all hover:border-primary",
                          activeSimulation === "london_pe"
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-secondary/30"
                        )}
                      >
                        <div>
                          <span className="text-xl">🇬🇧</span>
                          <h4 className="mt-2 font-display font-bold text-foreground text-sm">London PE Partner</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Inbound via Paid LinkedIn Ads • Looking for EBITDA expansion in UK/EU portfolio assets.
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                          {activeSimulation === "london_pe" ? "✓ Active Scenario" : "Simulate Scenario →"}
                        </span>
                      </button>

                      {/* Persona 2: NYC Fortune 500 */}
                      <button
                        onClick={() => applySimulation("nyc_board")}
                        className={cn(
                          "flex flex-col justify-between rounded-lg border p-4 text-left transition-all hover:border-primary",
                          activeSimulation === "nyc_board"
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-secondary/30"
                        )}
                      >
                        <div>
                          <span className="text-xl">🇺🇸</span>
                          <h4 className="mt-2 font-display font-bold text-foreground text-sm">NYC Board Member</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Direct executive referral • High-intent enterprise inquiry with enterprise ISP tier.
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                          {activeSimulation === "nyc_board" ? "✓ Active Scenario" : "Simulate Scenario →"}
                        </span>
                      </button>

                      {/* Persona 3: Singapore Scaleup */}
                      <button
                        onClick={() => applySimulation("singapore_scaleup")}
                        className={cn(
                          "flex flex-col justify-between rounded-lg border p-4 text-left transition-all hover:border-primary",
                          activeSimulation === "singapore_scaleup"
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-secondary/30"
                        )}
                      >
                        <div>
                          <span className="text-xl">🇸🇬</span>
                          <h4 className="mt-2 font-display font-bold text-foreground text-sm">Singapore FinTech CTO</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Organic search visitor • Submitting process workflow docs for 14-day AI feasibility audit.
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                          {activeSimulation === "singapore_scaleup" ? "✓ Active Scenario" : "Simulate Scenario →"}
                        </span>
                      </button>

                      {/* Reset Button */}
                      <button
                        onClick={() => applySimulation("reset")}
                        className={cn(
                          "flex flex-col justify-between rounded-lg border p-4 text-left transition-all hover:border-primary",
                          activeSimulation === "reset"
                            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                            : "border-border bg-secondary/30"
                        )}
                      >
                        <div>
                          <span className="text-xl">🌐</span>
                          <h4 className="mt-2 font-display font-bold text-foreground text-sm">Live Browser Session</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Revert to your real-world IP, location, timezone, dwell timer, and navigation stream.
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                          {activeSimulation === "reset" ? "✓ Real Live Telemetry" : "Reset Telemetry ↺"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Impact preview */}
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h4 className="font-display font-bold text-foreground text-sm">Live Persona Snapshot Output:</h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
                      <div className="rounded bg-secondary/50 p-3">
                        <span className="text-muted-foreground block text-[10px]">Predicted Intent Velocity:</span>
                        <span className="font-bold text-primary text-sm">{synergy.combinedLayering.urgencyScore}</span>
                      </div>
                      <div className="rounded bg-secondary/50 p-3">
                        <span className="text-muted-foreground block text-[10px]">Routing Channel Priority:</span>
                        <span className="font-bold text-foreground text-sm">{synergy.ipPlusTraffic.enterprisePriorityLevel}</span>
                      </div>
                      <div className="rounded bg-secondary/50 p-3">
                        <span className="text-muted-foreground block text-[10px]">Localized Desk Allocation:</span>
                        <span className="font-bold text-emerald-600 text-sm">{timezone.activeDesk.deskName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE TELEMETRY STREAM */}
              {activeTab === "telemetry" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">Live Telemetry Event Payload</h3>
                      <p className="text-xs text-muted-foreground">
                        Enriched event payload forwarded to Google Sheets analytics backend, Airtable multi-table router, and Jira ticketing.
                      </p>
                    </div>
                    <Button onClick={handleCopyPayload} size="sm" variant="outline">
                      {copied ? "Copied!" : "Copy JSON Payload"}
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 font-mono text-xs text-foreground overflow-x-auto max-h-[420px]">
                    <pre>{JSON.stringify(snapshot, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-4 py-2.5 sm:px-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Zero PII Exposure • High-Speed Session Telemetry • Enterprise GDPR/CCPA Compliant</span>
              </div>
              <button
                onClick={() => setConsoleOpen(false)}
                className="font-medium text-foreground hover:text-primary underline"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

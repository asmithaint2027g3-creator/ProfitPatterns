// src/components/intelligence/IntelligenceHeaderBar.tsx
import { ArrowRight, ChevronRight, Globe, Shield, Sparkles, X, Zap } from "lucide-react";
import React from "react";

import { useDigitalPresenceIntelligence } from "@/components/intelligence/IntelligenceContext";
import { cn } from "@/lib/utils";

export function IntelligenceHeaderBar() {
  const { snapshot, setConsoleOpen, headerBarDismissed, setHeaderBarDismissed } = useDigitalPresenceIntelligence();

  if (headerBarDismissed) return null;

  const { geo, timezone, session, traffic, synergy, isSimulated, simulatedPersonaName } = snapshot;

  return (
    <div className="relative z-40 border-b border-primary/20 bg-gradient-to-r from-secondary/90 via-background to-secondary/90 px-3 py-1.5 text-xs text-foreground backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        {/* Left: Intelligence Status & Live Geo/Time */}
        <div className="flex flex-wrap items-center gap-2 overflow-hidden sm:gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {isSimulated ? "Simulation Active" : "Intelligence Active"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-sm leading-none" title={geo.country}>{geo.flag}</span>
            <span className="font-medium text-foreground">
              {geo.city}, {geo.countryCode}
            </span>
            <span className="hidden text-border sm:inline">•</span>
            <span className="hidden sm:inline">
              {timezone.localTime} ({timezone.utcOffset})
            </span>
            <span className="hidden text-border md:inline">•</span>
            <span className="hidden items-center gap-1 text-emerald-700 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
              {timezone.activeDesk.deskName.split(" ")[0]} Desk Online ({timezone.activeDesk.responseTime})
            </span>
          </div>

          {isSimulated && (
            <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              Persona: {simulatedPersonaName}
            </span>
          )}
        </div>

        {/* Right: Funnel recommendation & Console Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setConsoleOpen(true)}
            className="group inline-flex items-center gap-1.5 rounded border border-primary/30 bg-primary/5 px-2.5 py-0.5 font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Sparkles className="size-3 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Traffic & Session Intelligence</span>
            <span className="sm:hidden">Telemetry</span>
            <ChevronRight className="size-3" />
          </button>

          <button
            onClick={() => setHeaderBarDismissed(true)}
            aria-label="Dismiss banner"
            className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

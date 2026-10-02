// src/components/intelligence/IntelligenceContext.tsx
import { useRouterState } from "@tanstack/react-router";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  getDigitalPresenceSnapshot,
  setSimulationPreset,
  type DigitalPresenceSnapshot,
  type SimulationPreset,
} from "@/utils/intelligence";

interface IntelligenceContextValue {
  snapshot: DigitalPresenceSnapshot;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
  activeSimulation: SimulationPreset;
  applySimulation: (preset: SimulationPreset) => void;
  headerBarDismissed: boolean;
  setHeaderBarDismissed: (dismissed: boolean) => void;
}

const IntelligenceContext = createContext<IntelligenceContextValue | null>(null);

export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [snapshot, setSnapshot] = useState<DigitalPresenceSnapshot>(() => getDigitalPresenceSnapshot("/"));
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<SimulationPreset>("reset");
  const [headerBarDismissed, setHeaderBarDismissed] = useState(false);

  // Update snapshot on route change
  useEffect(() => {
    setSnapshot(getDigitalPresenceSnapshot(pathname));
  }, [pathname]);

  // Live timer tick every second for real-time dwell tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setSnapshot(getDigitalPresenceSnapshot(pathname));
    }, 1000);
    return () => clearInterval(timer);
  }, [pathname]);

  const applySimulation = (preset: SimulationPreset) => {
    setActiveSimulation(preset);
    setSimulationPreset(preset);
    setSnapshot(getDigitalPresenceSnapshot(pathname));
  };

  return (
    <IntelligenceContext.Provider
      value={{
        snapshot,
        consoleOpen,
        setConsoleOpen,
        activeSimulation,
        applySimulation,
        headerBarDismissed,
        setHeaderBarDismissed,
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
}

export function useDigitalPresenceIntelligence() {
  const ctx = useContext(IntelligenceContext);
  if (!ctx) {
    throw new Error("useDigitalPresenceIntelligence must be used within an IntelligenceProvider");
  }
  return ctx;
}

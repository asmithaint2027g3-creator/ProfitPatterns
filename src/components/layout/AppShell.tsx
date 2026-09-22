import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { AssistantLauncher } from "@/components/chat/Assistant";
import { FloatingWhatsApp, MobileCTABar } from "@/components/cta/WhatsAppCTA";
import { LeadDialog } from "@/components/forms/LeadDialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { track } from "@/lib/analytics";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    track("page_view", { page: pathname });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <AssistantLauncher />
      <MobileCTABar onOpenForm={() => setLeadOpen(true)} />
      <LeadDialog open={leadOpen} onOpenChange={setLeadOpen} source="mobile_bar" />
    </div>
  );
}

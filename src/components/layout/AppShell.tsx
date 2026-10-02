import { useRef, useState, type ReactNode } from "react";

import { AssistantLauncher } from "@/components/chat/Assistant";
import { FloatingWhatsApp, MobileCTABar } from "@/components/cta/WhatsAppCTA";
import { LeadDialog } from "@/components/forms/LeadDialog";
import { IntelligenceProvider } from "@/components/intelligence/IntelligenceContext";
import { VisitorIntelligenceLayer } from "@/components/intelligence/VisitorIntelligenceLayer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
export function AppShell({ children }: { children: ReactNode }) {
  const [leadOpen, setLeadOpen] = useState(false);

  // Chatbot open state — lifted here so VisitorIntelligenceLayer can trigger it
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenerRef = useRef<(() => void) | null>(null);

  return (
    <IntelligenceProvider>
      {/* VisitorIntelligenceLayer sits OUTSIDE the main flex column
          so the banner can use position:fixed without layout side-effects */}
      <VisitorIntelligenceLayer
        onOpenChatbot={() => setChatOpen(true)}
        onRegisterChatbotOpener={(fn) => { chatOpenerRef.current = fn; }}
      />

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
        <AssistantLauncher externalOpen={chatOpen} onExternalOpenChange={setChatOpen} />
        <MobileCTABar onOpenForm={() => setLeadOpen(true)} />
        <LeadDialog open={leadOpen} onOpenChange={setLeadOpen} source="mobile_bar" />
      </div>
    </IntelligenceProvider>
  );
}

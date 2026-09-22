import { Link } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function FinalCTA({
  eyebrow,
  title = "Let's find the profit pattern in your business.",
  description = "Start with a short conversation about your objectives. No obligation, no scripted pitch — just an honest read on whether there's something worth doing.",
  location = "final_cta",
  showConsultation = true,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  location?: string;
  showConsultation?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] px-6 py-16 text-center text-[#FAFAF8] shadow-xl sm:px-12 sm:py-20">
      <div className="relative mx-auto max-w-3xl">
        {eyebrow && (
          <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#C4B296] mb-4">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#FAFAF8] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#D4CEBF] sm:text-lg">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap justify-center items-center gap-3.5">
          <Button
            asChild
            size="lg"
            variant="accent"
            className="bg-[#8B7355] text-white hover:bg-[#9B8365] border-0"
          >
            <Link to="/contact" onClick={() => track("cta_click", { location, cta: "talk_to_expert" })}>
              Talk to an Expert
            </Link>
          </Button>
          <WhatsAppCTA
            location={location}
            size="lg"
            variant="outline"
            className="border-[#4A453E] text-[#FAFAF8] hover:bg-[#2A2A2A] hover:border-[#8B7355]"
          />
          {showConsultation && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#4A453E] text-[#FAFAF8] hover:bg-[#2A2A2A] hover:border-[#8B7355]"
            >
              <Link to="/contact" onClick={() => track("cta_click", { location, cta: "consultation" })}>
                Request Strategy Consultation
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

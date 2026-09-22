import { MessageCircle } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { WHATSAPP_DEFAULT_MESSAGE, whatsappUrl } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface WhatsAppCTAProps {
  /** Where on the page this CTA sits — used for analytics attribution. */
  location: string;
  label?: string;
  message?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  showIcon?: boolean;
}

export function WhatsAppCTA({
  location,
  label = "Chat on WhatsApp",
  message = WHATSAPP_DEFAULT_MESSAGE,
  variant = "outline",
  size = "md",
  className,
  showIcon = true,
}: WhatsAppCTAProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location })}
      >
        {showIcon ? (
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        )}
        {label}
      </a>
    </Button>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ProfitPatterns on WhatsApp"
      onClick={() => track("whatsapp_click", { location: "floating_button" })}
      className={cn(
        "fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full",
        "bg-accent text-accent-foreground shadow-lg shadow-accent/30 transition-transform hover:scale-105",
      )}
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}

/** Sticky mobile conversion bar shown on small screens. */
export function MobileCTABar({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1 py-3"
          onClick={() => {
            track("cta_click", { location: "mobile_bar", cta: "talk_to_an_expert" });
            onOpenForm();
          }}
        >
          Talk to an Expert
        </Button>
        <WhatsAppCTA
          location="mobile_bar"
          label="WhatsApp"
          variant="accent"
          size="sm"
          className="flex-1 py-3"
        />
      </div>
    </div>
  );
}

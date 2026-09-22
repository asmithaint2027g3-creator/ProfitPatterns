import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-border rounded border border-border bg-card shadow-sm", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary cursor-pointer"
              >
                <span>{item.question}</span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded border border-border bg-secondary">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary",
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                className="px-6 pb-6 pt-1 text-sm leading-relaxed text-muted-foreground animate-rise"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

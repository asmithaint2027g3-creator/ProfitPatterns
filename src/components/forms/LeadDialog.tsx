import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { QuickForm } from "@/components/forms/QuickForm";

export function LeadDialog({
  open,
  onOpenChange,
  source = "dialog",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">Talk to an Expert</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Tell us where you're stuck. We reply within one business day.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <QuickForm source={source} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

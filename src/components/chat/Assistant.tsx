import { Link } from "@tanstack/react-router";
import { Loader2, MessageSquareText, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import {
  makeMessage,
  scriptedEngine,
  type AssistantState,
  type AssistantTurn,
  type ChatMessage,
  type ChoiceOption,
} from "@/lib/assistant-engine";
import { submitChatLead } from "@/lib/leads.functions";
import { trackLead } from "@/utils/analytics";
import { cn } from "@/lib/utils";

const engine = scriptedEngine;

export function Assistant({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turn, setTurn] = useState<AssistantTurn | null>(null);
  const [state, setState] = useState<AssistantState>({ step: "intent", lead: {} });
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedLead, setSavedLead] = useState(false);
  const leadStarted = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyTurn = useCallback((next: AssistantTurn) => {
    setTurn(next);
    setState(next.state);
    setMessages((prev) => [...prev, ...next.messages.map((m) => makeMessage("assistant", m))]);
  }, []);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    track("chat_open", {});
    applyTurn(engine.start());
  }, [open, messages.length, applyTurn]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, turn]);

  useEffect(() => {
    if (open && turn?.inputLabel) inputRef.current?.focus();
  }, [open, turn?.inputLabel]);

  const persistLead = useCallback(
    async (finalState: AssistantState) => {
      const { name, email, phone, company, businessProblem } = finalState.lead;
      if (!name || !email || !phone || !company || !businessProblem) return;
      setSaving(true);
      setSaveError(null);
      try {
        // Explicitly record chatbot lead into Lead_Management & Conversion_Events
        trackLead({
          name,
          email,
          phone: phone || "",
          company: company || "",
          requirement: finalState.intent || "",
          challenge: businessProblem || "",
          form_name: "Interactive AI Assistant",
          source: "assistant_chatbot",
        });

        try {
          await submitChatLead({
            data: {
              name,
              email,
              phone,
              company,
              businessProblem,
              intent: finalState.intent,
              page: typeof window !== "undefined" ? window.location.pathname : "/",
            },
          });
        } catch (e) {
          console.warn("Direct lead fallback to Google Sheets active:", e);
        }

        setSavedLead(true);
        track("chat_lead_completed", { intent: finalState.intent ?? "" });
      } catch {
        setSavedLead(true);
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  function send(value: string, displayLabel?: string) {
    if (!value.trim()) return;
    setMessages((prev) => [...prev, makeMessage("user", displayLabel ?? value)]);
    track("chat_message", { step: state.step });
    if (!leadStarted.current && state.step === "name") {
      leadStarted.current = true;
      track("chat_lead_started", {});
    }
    const next = engine.next(state, value);
    applyTurn(next);
    setDraft("");
    if (next.leadComplete) void persistLead(next.state);
  }

  function handleChoice(option: ChoiceOption) {
    if (!leadStarted.current && state.step === "urgency") {
      leadStarted.current = true;
      track("chat_lead_started", {});
    }
    send(option.value, option.label);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="ProfitPatterns Assistant"
      className="fixed bottom-24 right-4 z-40 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded border border-border bg-card shadow-xl md:bottom-24 md:right-5"
    >
      <header className="flex items-center justify-between border-b border-border bg-[#FBF9F5] px-4 py-3">
        <div>
          <p className="font-display text-sm font-bold text-foreground">ProfitPatterns Assistant</p>
          <p className="text-[11px] text-muted-foreground">Guided consultation · instant response</p>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close assistant"
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] text-sm leading-relaxed",
              m.role === "user"
                ? "ml-auto rounded bg-primary px-3.5 py-2.5 text-white"
                : "text-foreground/90",
            )}
          >
            {m.text}
          </div>
        ))}

        {turn?.options ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {turn.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChoice(option)}
                className="rounded border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/60 cursor-pointer"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        {turn?.finalActions ? (
          <div className="space-y-2 pt-2">
            {saving ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Saving your details…
              </p>
            ) : null}
            {savedLead ? (
              <p className="text-xs text-accent">Details saved. We'll be in touch.</p>
            ) : null}
            {saveError ? (
              <p role="alert" className="text-xs text-destructive">
                {saveError}
              </p>
            ) : null}
            <WhatsAppCTA
              location="assistant"
              label="Continue on WhatsApp"
              variant="accent"
              size="sm"
              className="w-full"
            />
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/contact" onClick={() => onOpenChange(false)}>
                Submit Detailed Form
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/contact" onClick={() => onOpenChange(false)}>
                Talk to an Expert
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      {turn?.inputLabel ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            {turn.inputLabel}
          </label>
          <input
            id="assistant-input"
            ref={inputRef}
            type={turn.inputType ?? "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={turn.inputLabel}
            className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none"
          />
          <Button type="submit" variant="accent" size="sm" aria-label="Send message">
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Assistant open={open} onOpenChange={setOpen} />
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close ProfitPatterns Assistant" : "Open ProfitPatterns Assistant"}
        aria-expanded={open}
        className="fixed bottom-20 right-4 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 md:bottom-5 md:right-5"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageSquareText className="size-6" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Minus,
  Paperclip,
  Send,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { track } from "@/lib/analytics";
import { useVisitorContext } from "@/components/intelligence/VisitorIntelligenceLayer";
import { submitChatLead } from "@/lib/leads.functions";
import { trackLead } from "@/utils/analytics";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
  options?: { label: string; value: string; isPrimary?: boolean; link?: string }[];
  fileAttachment?: { name: string; size: string };
}

function getFormattedTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function Assistant({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { isRepeatVisitor, visitCount, greeting } = useVisitorContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [savingLead, setSavingLead] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize opening message from Arya
  useEffect(() => {
    if (!open || messages.length > 0) return;
    track("chat_open", { isRepeatVisitor, visitCount });

    const initialText = isRepeatVisitor
      ? `${greeting}! Welcome back to ProfitPatterns — great to see you again for visit #${visitCount}! I'm Arya, a senior consultant here. What sort of profit optimization or AI strategy requirements are you exploring today?`
      : "Hi, Welcome to ProfitPatterns! I'm Arya, a senior consultant here. What sort of profit optimization or AI strategy requirements are you exploring today?";

    const welcomeMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      text: initialText,
      time: getFormattedTime(),
      options: [
        { label: "Request a Callback →", value: "request_callback", isPrimary: true },
        { label: "Our Services", value: "services" },
        { label: "About ProfitPatterns", value: "about" },
        { label: "Free AI Audit", value: "audit" },
      ],
    };

    setMessages([welcomeMsg]);
  }, [open, messages.length, isRepeatVisitor, visitCount, greeting]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // Lead detection helper
  const tryCaptureLead = useCallback(
    async (text: string, contextNote: string) => {
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
      const phoneRegex = /(\+?[0-9]{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d]{3}[-.\s]?[\d]{4}/;

      const emailMatch = text.match(emailRegex);
      const phoneMatch = text.match(phoneRegex);

      if ((emailMatch || phoneMatch) && !leadCaptured) {
        setSavingLead(true);
        const email = emailMatch ? emailMatch[0] : "";
        const phone = phoneMatch ? phoneMatch[0] : "";
        const nameGuess = text.replace(email, "").replace(phone, "").trim().slice(0, 50) || "Chatbot Prospect";

        trackLead({
          name: nameGuess,
          email: email || "prospect@chat.lead",
          phone: phone,
          company: "Not specified",
          requirement: contextNote,
          challenge: text,
          form_name: "Arya AI Assistant",
          source: "assistant_chatbot",
        });

        try {
          await submitChatLead({
            data: {
              name: nameGuess,
              email: email || "prospect@chat.lead",
              phone: phone,
              company: "Not specified",
              businessProblem: text,
              intent: contextNote,
              page: typeof window !== "undefined" ? window.location.pathname : "/",
            },
          });
        } catch (e) {
          console.warn("Direct lead forward fallback:", e);
        }

        setLeadCaptured(true);
        setSavingLead(false);

        // Assistant confirmation
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "assistant",
              text: `✅ Thank you! I have logged your details (${email || phone}). Our senior advisory team will review your requirements and reach out within 24 hours.`,
              time: getFormattedTime(),
              options: [
                { label: "Book a 15-min Call", value: "contact_page", link: "/contact" },
                { label: "Submit Detailed Audit", value: "audit_page", link: "/audit-submission" },
              ],
            },
          ]);
        }, 500);
      }
    },
    [leadCaptured],
  );

  // Generate intelligent response based on input
  const handleAssistantResponse = useCallback(
    (userInput: string, optionValue?: string) => {
      setIsTyping(true);
      const query = (optionValue || userInput).toLowerCase().trim();

      setTimeout(() => {
        let replyText = "";
        let nextOptions: ChatMessage["options"] = undefined;

        if (query === "request_callback" || query.includes("callback") || query.includes("call me")) {
          replyText =
            "I'd be glad to arrange a callback with one of our principal partners. Please share your **phone number or email address** below, or connect with our desk directly on WhatsApp!";
          nextOptions = [
            { label: "Chat on WhatsApp", value: "whatsapp", isPrimary: true },
            { label: "Schedule on Calendar →", value: "calendar", link: "/contact" },
          ];
        } else if (query === "services" || query.includes("service") || query.includes("what do you do") || query.includes("offering")) {
          replyText =
            "ProfitPatterns accelerates revenue & margin through 4 proven pillars:\n\n" +
            "1. **AI Strategy & Diagnostic**: 14-day operational audit & leak scorecard\n" +
            "2. **Profit Growth Architecture**: Margin expansion & leak recovery\n" +
            "3. **Business Process Automation**: Custom agentic workflows saving 40+ hrs/wk\n" +
            "4. **Data & Analytics Engine**: Predictive executive decision models\n\n" +
            "Which of these areas are you most focused on right now?";
          nextOptions = [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Free AI Audit", value: "audit" },
            { label: "Talk to an Expert", value: "calendar", link: "/contact" },
          ];
        } else if (query === "about" || query.includes("about") || query.includes("who are you")) {
          replyText =
            "ProfitPatterns is an enterprise AI & profit engineering advisory. We help businesses discover hidden margin leaks, implement automated workflows, and build proprietary AI systems that produce verified ROI within 14 to 30 days.";
          nextOptions = [
            { label: "Our Services", value: "services" },
            { label: "Free AI Audit", value: "audit" },
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
          ];
        } else if (query === "audit" || query.includes("audit") || query.includes("diagnostic") || query.includes("free audit")) {
          replyText =
            "Our **14-day AI Diagnostic** evaluates your operational bottlenecks and produces an executive ROI scorecard at zero cost. We map high-friction workflows and calculate exact potential savings.";
          nextOptions = [
            { label: "Submit Free Audit Form →", value: "audit_page", link: "/audit-submission", isPrimary: true },
            { label: "Request a Callback", value: "request_callback" },
          ];
        } else if (query === "whatsapp") {
          window.open(
            "https://wa.me/919487569857?text=Hi%20ProfitPatterns%20Team%2C%20I%20would%20like%20to%20speak%20with%20a%20consultant.",
            "_blank",
          );
          replyText = "Opening our official WhatsApp channel for direct consultation. Feel free to type additional questions here anytime!";
        } else if (query.includes("pricing") || query.includes("cost") || query.includes("price") || query.includes("how much")) {
          replyText =
            "Our initial **14-day AI Diagnostic is 100% complimentary**. Full implementation engagements are tailored and milestone-based so you only pay for proven ROI and measurable cost reduction. Would you like to schedule an introductory consultation?";
          nextOptions = [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Schedule Call", value: "calendar", link: "/contact" },
          ];
        } else if (query.includes("security") || query.includes("safe") || query.includes("confidential") || query.includes("nda")) {
          replyText =
            "Security and confidentiality are core to everything we do. We operate under strict mutual NDAs, use SOC-2 compliant infrastructure, and ensure none of your business data is ever retained for public model training.";
          nextOptions = [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Our Services", value: "services" },
          ];
        } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
          replyText = "Hello! How can I assist with your business AI and profit strategy today?";
          nextOptions = [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Our Services", value: "services" },
            { label: "Free AI Audit", value: "audit" },
          ];
        } else {
          // General inquiry response
          replyText =
            "Thank you for sharing that! Our consulting team specializes in addressing this exact challenge through automated intelligence and margin optimization. Would you like to speak directly with our senior strategist, or receive our complimentary audit?";
          nextOptions = [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Submit Free Audit Form", value: "audit_page", link: "/audit-submission" },
            { label: "Our Services", value: "services" },
          ];
        }

        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            text: replyText,
            time: getFormattedTime(),
            options: nextOptions,
          },
        ]);

        // Attempt lead capture in background
        void tryCaptureLead(userInput, optionValue || "General Assistant Chat");
      }, 550);
    },
    [tryCaptureLead],
  );

  // Send message from user
  const handleSend = (textToSend?: string, optionValue?: string) => {
    const text = (textToSend ?? draft).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      text,
      time: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    track("chat_message_sent", { text });

    handleAssistantResponse(text, optionValue);
  };

  // Handle file selection via paperclip
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      text: `📎 Attached: ${file.name} (${sizeFormatted})`,
      time: getFormattedTime(),
      fileAttachment: { name: file.name, size: sizeFormatted },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          text: `I've received your document **"${file.name}"** for evaluation. Please provide your **work email or phone number** below so our diagnostic team can deliver the findings to you!`,
          time: getFormattedTime(),
          options: [
            { label: "Request a Callback →", value: "request_callback", isPrimary: true },
            { label: "Book a Call", value: "calendar", link: "/contact" },
          ],
        },
      ]);
    }, 700);

    // Reset input
    e.target.value = "";
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Arya - Senior Consultant"
      className="fixed bottom-24 right-4 z-50 flex h-[min(36rem,calc(100vh-7.5rem))] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all duration-200 md:bottom-24 md:right-6"
    >
      {/* ── TOP HEADER (Royal Blue matching reference screenshot) ── */}
      <header className="relative flex items-center justify-between bg-[#185ADB] px-4 py-3.5 text-white shadow-sm select-none">
        <div className="flex items-center gap-3">
          {/* Avatar with Sparkles & Live Status Indicator */}
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500/40 border border-blue-300/40 text-white shadow-xs">
            <Sparkles className="size-5 text-white" />
            <span
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-[#185ADB]"
              title="Online"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight leading-none">Arya</span>
            </div>
            <span className="text-[10px] font-semibold text-blue-100 tracking-wider uppercase mt-1">
              SENIOR CONSULTANT
            </span>
          </div>
        </div>

        {/* Action icons: Minimize & Close */}
        <div className="flex items-center gap-1 text-white/90">
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Minimize assistant"
            className="rounded p-1.5 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close assistant"
            className="rounded p-1.5 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* ── MESSAGE THREAD ── */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-[#F8FAFC] p-4 text-slate-800"
        aria-live="polite"
      >
        {messages.map((m) => (
          <div key={m.id} className="space-y-2">
            {m.role === "assistant" ? (
              <div className="flex items-start gap-2.5 max-w-[92%]">
                {/* Bot Icon Shield on Left (as in reference screenshot) */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#185ADB] text-white shadow-xs mt-0.5">
                  <Shield className="size-4.5" />
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {/* Assistant Message Bubble */}
                  <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-xs whitespace-pre-line">
                    {m.text}
                  </div>

                  {/* Quick Action Pill Buttons */}
                  {m.options && m.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.options.map((opt) =>
                        opt.link ? (
                          <Link
                            key={opt.value}
                            to={opt.link as "/"}
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-[#185ADB] hover:text-[#185ADB] hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <span>{opt.label}</span>
                            <ArrowRight className="size-3 text-[#185ADB]" />
                          </Link>
                        ) : (
                          <button
                            key={opt.value}
                            onClick={() => handleSend(opt.label, opt.value)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer",
                              opt.isPrimary
                                ? "border-slate-200 bg-white text-slate-800 hover:border-[#185ADB] hover:text-[#185ADB] hover:bg-blue-50/50"
                                : "border-slate-200 bg-white text-slate-700 hover:border-[#185ADB] hover:text-[#185ADB] hover:bg-blue-50/50",
                            )}
                          >
                            <span>{opt.label}</span>
                            {opt.isPrimary && <ArrowRight className="size-3 text-[#185ADB]" />}
                          </button>
                        ),
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] font-medium text-slate-400 pl-1">{m.time}</span>
                </div>
              </div>
            ) : (
              /* User Message on Right with Avatar */
              <div className="flex items-start justify-end gap-2.5 ml-auto max-w-[85%]">
                <div className="flex flex-col items-end gap-1">
                  <div className="rounded-2xl rounded-tr-sm bg-[#185ADB] px-4 py-2.5 text-sm font-medium text-white shadow-xs leading-relaxed">
                    {m.fileAttachment ? (
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 shrink-0" />
                        <span>{m.fileAttachment.name}</span>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 pr-1">{m.time}</span>
                </div>

                {/* User Avatar Circle */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 mt-0.5 shadow-xs">
                  <User className="size-4" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[80%]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#185ADB] text-white shadow-xs mt-0.5">
              <Shield className="size-4.5" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 text-slate-400 shadow-xs">
              <span className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM INPUT SECTION (Pill styled as in reference) ── */}
      <footer className="border-t border-slate-100 bg-white p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-[#F8FAFC] px-3.5 py-1.5 shadow-xs transition-colors focus-within:border-[#185ADB] focus-within:bg-white"
        >
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt,image/*"
          />

          {/* Paperclip button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach a file or document"
            className="text-slate-400 hover:text-[#185ADB] transition-colors p-1 cursor-pointer shrink-0"
          >
            <Paperclip className="size-4.5" />
          </button>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask Arya or paste files..."
            className="flex-1 bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer",
              draft.trim()
                ? "bg-[#185ADB] text-white shadow-xs hover:bg-blue-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            )}
          >
            <Send className="size-3.5 -ml-0.5" />
          </button>
        </form>

        {/* Subtitle branding as in reference screenshot */}
        <p className="mt-2 text-center text-[9px] font-bold tracking-widest text-slate-400 uppercase select-none">
          OFFICIAL PROFITPATTERNS SUPPORT
        </p>
      </footer>
    </div>
  );
}

export function AssistantLauncher({
  externalOpen,
  onExternalOpenChange,
}: {
  externalOpen?: boolean;
  onExternalOpenChange?: (v: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onExternalOpenChange?.(v);
  };

  const { registerChatbotOpener } = useVisitorContext();
  useEffect(() => {
    registerChatbotOpener(() => setOpen(true));
  }, [registerChatbotOpener]);

  return (
    <>
      <Assistant open={open} onOpenChange={setOpen} />

      {/* Floating launcher trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Arya Chatbot" : "Chat with Arya - Senior Consultant"}
        aria-expanded={open}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2.5 rounded-full bg-[#185ADB] px-4 py-3 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:bg-blue-700 md:bottom-6 md:right-6 group cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          {open ? (
            <X className="size-5" />
          ) : (
            <>
              <Sparkles className="size-5 text-white" />
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#185ADB]" />
            </>
          )}
        </div>
        <span className="text-sm font-semibold pr-1">
          {open ? "Close" : "Chat with Arya"}
        </span>
      </button>
    </>
  );
}

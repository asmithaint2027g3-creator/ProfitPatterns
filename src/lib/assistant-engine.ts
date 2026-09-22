/**
 * ProfitPatterns Assistant — conversation engine.
 *
 * The UI talks to an `AssistantEngine` interface only. The scripted engine
 * below runs entirely in the browser with no keys involved. To move to an LLM,
 * implement the same interface against a server function that holds the key
 * server-side — the UI needs no changes and no key ever reaches the client.
 */

export type MessageRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

export interface ChoiceOption {
  label: string;
  value: string;
}

export type FinalAction = "whatsapp" | "long_form" | "expert";

export interface AssistantState {
  step: string;
  intent?: string | undefined;
  serviceSlug?: string | undefined;
  lead: {
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    company?: string | undefined;
    businessProblem?: string | undefined;
  };
}

export interface AssistantTurn {
  messages: string[];
  /** Quick-reply buttons, when the step expects a choice. */
  options?: ChoiceOption[] | undefined;
  /** Free-text input label, when the step expects typing. */
  inputLabel?: string | undefined;
  inputType?: "text" | "email" | "tel" | undefined;
  /** Set when the lead details are complete and ready to submit. */
  leadComplete?: boolean | undefined;
  /** Set on the closing step. */
  finalActions?: boolean | undefined;
  state: AssistantState;
}

export interface AssistantEngine {
  start: () => AssistantTurn;
  next: (state: AssistantState, input: string) => AssistantTurn;
}

export const INTENTS: { value: string; label: string; serviceSlug?: string; reply: string }[] = [
  {
    value: "profitability",
    label: "Increase profitability",
    serviceSlug: "profit-growth-strategy",
    reply:
      "Profitability work usually starts with a model of where margin actually comes from, then a review of which initiatives support it.",
  },
  {
    value: "automation",
    label: "Automate processes",
    serviceSlug: "business-automation",
    reply:
      "We start by measuring which workflows consume the most hours, then automate the ones where automation genuinely holds.",
  },
  {
    value: "ai",
    label: "Use AI in my business",
    serviceSlug: "ai-strategy",
    reply:
      "The useful first step is identifying practical AI use cases tied to a business objective, rather than adopting tools and hoping.",
  },
  {
    value: "data",
    label: "Improve data and analytics",
    serviceSlug: "data-analytics",
    reply:
      "We work backwards from the decisions you need to make, then agree the small set of measures that support them.",
  },
  {
    value: "process",
    label: "Improve business processes",
    serviceSlug: "process-optimization",
    reply:
      "Process work begins with measuring where delay, rework and cost accumulate — then redesigning only those steps.",
  },
  {
    value: "expert",
    label: "Talk to an expert",
    reply: "Happy to arrange that. A few details and we'll take it from there.",
  },
  {
    value: "exploring",
    label: "Just exploring",
    reply:
      "That's fine — no pressure. I can point you to the right place, and you can leave your details only if it's useful.",
  },
];

const URGENCY_OPTIONS: ChoiceOption[] = [
  { label: "Actively looking for help now", value: "now" },
  { label: "Planning for the next few months", value: "soon" },
  { label: "Researching for later", value: "later" },
];

const ROLE_OPTIONS: ChoiceOption[] = [
  { label: "Founder or owner", value: "founder" },
  { label: "Operations", value: "operations" },
  { label: "Finance or commercial", value: "finance" },
  { label: "Technology", value: "technology" },
  { label: "Something else", value: "other" },
];

function id() {
  return Math.random().toString(36).slice(2);
}

export function makeMessage(role: MessageRole, text: string): ChatMessage {
  return { id: id(), role, text };
}

const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneLike = /^[+\d][\d\s()-]{5,}$/;

export const scriptedEngine: AssistantEngine = {
  start() {
    return {
      messages: ["Hi! Welcome to ProfitPatterns. What would you like help with?"],
      options: INTENTS.map((i) => ({ label: i.label, value: i.value })),
      state: { step: "intent", lead: {} },
    };
  },

  next(state, input) {
    const value = input.trim();
    const lead = { ...state.lead };

    switch (state.step) {
      case "intent": {
        const intent = INTENTS.find((i) => i.value === value) ?? INTENTS[INTENTS.length - 1]!;
        return {
          messages: [intent.reply, "Which best describes your role?"],
          options: ROLE_OPTIONS,
          state: { ...state, step: "role", intent: intent.label, serviceSlug: intent.serviceSlug, lead },
        };
      }

      case "role": {
        return {
          messages: [
            "Thanks. In a sentence or two — what's the business problem you're trying to solve?",
          ],
          inputLabel: "Describe the problem",
          state: { ...state, step: "problem", lead },
        };
      }

      case "problem": {
        if (value.length < 5) {
          return {
            messages: ["Could you give me a little more detail?"],
            inputLabel: "Describe the problem",
            state,
          };
        }
        lead.businessProblem = value.slice(0, 2000);
        return {
          messages: ["Understood. How soon are you looking to act on this?"],
          options: URGENCY_OPTIONS,
          state: { ...state, step: "urgency", lead },
        };
      }

      case "urgency": {
        return {
          messages: [
            "That helps. If you'd like us to follow up, I just need a few details. What's your name?",
          ],
          inputLabel: "Your name",
          state: { ...state, step: "name", lead },
        };
      }

      case "name": {
        if (value.length < 2) {
          return { messages: ["Please enter your name."], inputLabel: "Your name", state };
        }
        lead.name = value.slice(0, 100);
        return {
          messages: [`Thanks, ${lead.name}. What's the best email to reach you on?`],
          inputLabel: "Work email",
          inputType: "email",
          state: { ...state, step: "email", lead },
        };
      }

      case "email": {
        if (!emailLike.test(value)) {
          return {
            messages: ["That doesn't look like a valid email address — could you check it?"],
            inputLabel: "Work email",
            inputType: "email",
            state,
          };
        }
        lead.email = value.slice(0, 255);
        return {
          messages: ["And a phone number, in case WhatsApp is quicker?"],
          inputLabel: "Phone number",
          inputType: "tel",
          state: { ...state, step: "phone", lead },
        };
      }

      case "phone": {
        if (!phoneLike.test(value)) {
          return {
            messages: ["Please enter a valid phone number, including country code."],
            inputLabel: "Phone number",
            inputType: "tel",
            state,
          };
        }
        lead.phone = value.slice(0, 30);
        return {
          messages: ["Last one — which company are you with?"],
          inputLabel: "Company",
          state: { ...state, step: "company", lead },
        };
      }

      case "company": {
        if (value.length < 2) {
          return { messages: ["Please enter your company name."], inputLabel: "Company", state };
        }
        lead.company = value.slice(0, 120);
        return {
          messages: [
            "That's everything, thank you. Someone will review this and reply within one business day.",
            "How would you like to continue?",
          ],
          leadComplete: true,
          finalActions: true,
          state: { ...state, step: "done", lead },
        };
      }

      default:
        return {
          messages: ["Is there anything else I can help you with?"],
          options: INTENTS.map((i) => ({ label: i.label, value: i.value })),
          state: { step: "intent", lead },
        };
    }
  },
};

import { z } from "zod";

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "IN_PROGRESS",
  "CONVERTED",
  "CLOSED",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_CTA_TYPES = ["WHATSAPP", "QUICK_FORM", "LONG_FORM", "CHATBOT"] as const;
export type LeadCtaType = (typeof LEAD_CTA_TYPES)[number];

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  industry?: string | null;
  companySize?: string | null;
  requirement?: string | null;
  challenge?: string | null;
  desiredOutcome?: string | null;
  source?: string | null;
  ctaType: LeadCtaType;
  page?: string | null;
  status: LeadStatus;
  createdAt: string;
}

const trimmed = (max: number) => z.string().trim().max(max);

export const PRIMARY_CHALLENGES = [
  "AI Strategy",
  "Business Automation",
  "Process Optimization",
  "Revenue Growth",
  "Cost Reduction",
  "Data & Analytics",
  "Digital Transformation",
  "Other",
] as const;

export const COMPANY_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–1000",
  "1000+",
] as const;

export const PROJECT_SCOPES = [
  "Exploratory conversation",
  "Assessment or diagnostic",
  "Defined project",
  "Ongoing advisory",
  "Not sure yet",
] as const;

export const BUDGET_RANGES = [
  "Not defined yet",
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
] as const;

export const CONTACT_TIMES = ["Morning", "Afternoon", "Evening", "Any time"] as const;

export const AI_USAGE_LEVELS = [
  "None yet",
  "Experimenting informally",
  "A few tools in production",
  "Widely adopted",
] as const;

/** Honeypot field shared by both forms — real users never fill it. */
export const honeypotSchema = z.object({
  companyWebsiteHp: z.string().max(0, { message: "Submission rejected." }).optional(),
});

export const quickLeadSchema = honeypotSchema.extend({
  name: trimmed(100).min(2, { message: "Please enter your name." }),
  email: trimmed(255).email({ message: "Please enter a valid email address." }),
  phone: trimmed(30).min(6, { message: "Please enter a valid phone number." }),
  company: trimmed(120).min(2, { message: "Please enter your company." }),
  requirement: trimmed(120).min(1, { message: "Please choose what you need help with." }),
  message: trimmed(1500).min(10, { message: "Please add a little more detail (10+ characters)." }),
  page: trimmed(200).optional(),
  source: trimmed(120).optional(),
});
export type QuickLeadInput = z.infer<typeof quickLeadSchema>;

export const consultationLeadSchema = honeypotSchema.extend({
  fullName: trimmed(100).min(2, { message: "Please enter your full name." }),
  workEmail: trimmed(255).email({ message: "Please enter a valid work email." }),
  phone: trimmed(30).min(6, { message: "Please enter a valid phone number." }),
  company: trimmed(120).min(2, { message: "Please enter your company." }),
  jobTitle: trimmed(120).min(2, { message: "Please enter your job title." }),
  industry: trimmed(120).min(2, { message: "Please enter your industry." }),
  companySize: trimmed(40).min(1, { message: "Please select a company size." }),
  website: trimmed(200).optional().or(z.literal("")),
  primaryChallenge: trimmed(80).min(1, { message: "Please select a primary challenge." }),
  currentChallenge: trimmed(2000).min(20, {
    message: "Please describe the challenge in a little more detail (20+ characters).",
  }),
  desiredOutcome: trimmed(2000).min(20, {
    message: "Please describe the outcome you want (20+ characters).",
  }),
  currentTools: trimmed(500).optional().or(z.literal("")),
  existingAIUsage: trimmed(80).min(1, { message: "Please select an option." }),
  projectScope: trimmed(80).min(1, { message: "Please select a scope." }),
  budgetRange: trimmed(80).min(1, { message: "Please select a range." }),
  preferredContactTime: trimmed(40).min(1, { message: "Please select a preferred time." }),
  page: trimmed(200).optional(),
  source: trimmed(120).optional(),
});
export type ConsultationLeadInput = z.infer<typeof consultationLeadSchema>;

export const chatLeadSchema = honeypotSchema.extend({
  name: trimmed(100).min(2, { message: "Please enter your name." }),
  email: trimmed(255).email({ message: "Please enter a valid email address." }),
  phone: trimmed(30).min(6, { message: "Please enter a valid phone number." }),
  company: trimmed(120).min(2, { message: "Please enter your company." }),
  businessProblem: trimmed(2000).min(5, { message: "Please describe the problem briefly." }),
  intent: trimmed(120).optional(),
  page: trimmed(200).optional(),
});
export type ChatLeadInput = z.infer<typeof chatLeadSchema>;

export type LeadSubmitResult = { ok: true; id: string } | { ok: false; error: string };

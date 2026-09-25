import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  FileCheck,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { AuditDocumentForm } from "@/components/forms/AuditDocumentForm";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { breadcrumbSchema, canonical, organizationSchema, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/audit-submission")({
  head: () => ({
    meta: pageMeta({
      title: "Submit Process for AI Automation Audit | ProfitPatterns",
      description:
        "Upload your SOPs, workflow maps, operational spreadsheets, or project specifications. Get a confidential AI automation feasibility & ROI scorecard within 48 hours.",
    }),
    links: canonical("/audit-submission"),
    scripts: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "AI Process Audit", path: "/audit-submission" },
      ]),
    ],
  }),
  component: AuditSubmissionPage,
});

const AUDIT_STEPS = [
  {
    step: "01",
    title: "Secure Ingestion & NDA",
    desc: "Your files are stored securely and reviewed exclusively under our mutual confidentiality protocols.",
  },
  {
    step: "02",
    title: "Workflow Deconstruction",
    desc: "Our AI practice models your manual steps, time bottlenecks, error rates, and system touchpoints.",
  },
  {
    step: "03",
    title: "Feasibility Scorecard",
    desc: "Receive an executive report ranking automation opportunities by ROI, risk, and time-to-value.",
  },
  {
    step: "04",
    title: "Strategic Debrief",
    desc: "An optional 20-minute executive session to walk through recommendations and practical next steps.",
  },
];

const DELIVERABLES = [
  {
    title: "Process Friction & Bottleneck Map",
    desc: "Detailed identification of manual data re-entry, cross-checking delays, and repetitive workflows.",
  },
  {
    title: "AI & Automation Solution Matrix",
    desc: "Objective classification: Deterministic Automation vs. LLM Agents vs. Traditional APIs.",
  },
  {
    title: "Cost & Labor Savings Projection",
    desc: "Quantified estimate of recoverable team hours, payback period, and 12-month margin gain.",
  },
  {
    title: "Phased Deployment Roadmap",
    desc: "A pragmatic 30-60-90 day pilot plan with risk mitigation and change management considerations.",
  },
];

const FAQS = [
  {
    q: "Can we execute an NDA before sharing proprietary documentation?",
    a: "Absolutely. Simply check the 'Apply Mutual NDA' option on the form or contact us directly. We will counter-sign your corporate agreement or supply our standard mutual NDA before processing any materials.",
  },
  {
    q: "What types of documents are most valuable for an audit?",
    a: "Standard Operating Procedures (SOPs), process runbooks, workflow flowcharts (Miro, Visio, PDF), sample anonymized transaction spreadsheets, or technical RFP briefs all provide excellent context.",
  },
  {
    q: "Is any of our data used to train public AI models?",
    a: "Never. All documents and discussions are strictly confidential and governed by institutional security standards. We do not feed client information to external foundation models.",
  },
  {
    q: "What is the turnaround time?",
    a: "Standard turnaround for preliminary scorecard delivery is 24 to 48 business hours. For complex multi-department workflows, our team will reach out with a scoped diagnostic schedule.",
  },
];

function AuditSubmissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Process AI Audit"
        title="Submit Your Documentation for an AI Automation & ROI Audit."
        description="Upload your SOPs, workflow maps, operational spreadsheets, or project specifications. Our senior AI advisory practice will analyze manual overhead, evaluate automation feasibility, and deliver an executive scorecard with measurable P&L impact."
      />

      {/* Trust Highlights Bar */}
      <div className="border-y border-border bg-[#F5F2EB] py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-4 px-4 text-xs font-semibold text-foreground sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-primary" />
            <span>100% Confidential Under Mutual NDA</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span>24–48 Hour Review Turnaround</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <span>Quantified ROI & P&L Impact Assessment</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <span>Zero Software Vendor Bias</span>
          </div>
        </div>
      </div>

      {/* Main Submission Section */}
      <Section className="py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] items-start">
          {/* Submission Form Column */}
          <ScrollReveal delay={0} direction="up">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Intake Dossier
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Upload Process Specifications
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Provide your documentation and business context below. All files are encrypted during transit and review.
                </p>
              </div>

              <AuditDocumentForm source="audit_submission_page" />
            </div>
          </ScrollReveal>

          {/* Sidebar Guidance & Reassurance */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* What you receive */}
            <ScrollReveal delay={100} direction="left">
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-base">
                  <Sparkles className="size-5" />
                  <h3>What's Inside Your Audit Scorecard</h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Every submission is thoroughly reviewed by senior partners to deliver actionable, vendor-neutral intelligence:
                </p>

                <div className="mt-4 space-y-3.5">
                  {DELIVERABLES.map((d) => (
                    <div key={d.title} className="flex items-start gap-2.5">
                      <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{d.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Audit Workflow Timeline */}
            <ScrollReveal delay={150} direction="left">
              <div className="rounded-xl border border-border bg-[#FBF9F5] p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  How The Audit Works
                </h3>
                <div className="mt-4 space-y-4">
                  {AUDIT_STEPS.map((s) => (
                    <div key={s.step} className="flex gap-3">
                      <span className="font-mono text-xs font-bold text-primary shrink-0">{s.step}</span>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{s.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Alternative Direct Route */}
            <ScrollReveal delay={200} direction="left">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
                <h4 className="text-xs font-bold text-foreground">Prefer an introductory discussion first?</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  If you’d rather talk through requirements before uploading documentation, connect directly with our advisory practice.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <WhatsAppCTA location="audit_page_sidebar" size="sm" variant="accent" />
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-[#F2EFE9] transition-colors"
                  >
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Frequently Asked Questions */}
      <Section className="border-t border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Audit FAQ"
            title="Questions About Document Submission & Security."
            description="Clear answers regarding data protection, legal compliance, and what to expect from the diagnostic."
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 60} direction="up">
              <div className="rounded-lg border border-border bg-card p-6 shadow-xs h-full">
                <h3 className="text-sm font-bold text-foreground flex items-start gap-2">
                  <HelpCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground pl-6">
                  {faq.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>
    </>
  );
}

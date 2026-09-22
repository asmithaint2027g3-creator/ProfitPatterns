import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Honeypot, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { track } from "@/lib/analytics";
import {
  AI_USAGE_LEVELS,
  BUDGET_RANGES,
  COMPANY_SIZES,
  CONTACT_TIMES,
  PRIMARY_CHALLENGES,
  PROJECT_SCOPES,
  consultationLeadSchema,
} from "@/lib/leads";
import { submitConsultationLead } from "@/lib/leads.functions";

const EMPTY = {
  fullName: "",
  workEmail: "",
  phone: "",
  company: "",
  jobTitle: "",
  industry: "",
  companySize: "",
  website: "",
  primaryChallenge: "",
  currentChallenge: "",
  desiredOutcome: "",
  currentTools: "",
  existingAIUsage: "",
  projectScope: "",
  budgetRange: "",
  preferredContactTime: "",
};

type Field = keyof typeof EMPTY;
type Errors = Partial<Record<Field | "form", string>>;

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">{legend}</legend>
      {children}
    </fieldset>
  );
}

export function LongForm({ source = "long_form" }: { source?: string }) {
  const [values, setValues] = useState(EMPTY);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const submitting = useRef(false);

  useEffect(() => {
    track("long_form_open", { source });
  }, [source]);

  function set(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => { const next = { ...e }; delete next[field]; delete next.form; return next; });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;

    const page = typeof window !== "undefined" ? window.location.pathname : "/";
    const parsed = consultationLeadSchema.safeParse({
      ...values,
      companyWebsiteHp: hp,
      page,
      source,
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        document.getElementById(`lf-${firstKey}`)?.focus();
      }
      return;
    }

    submitting.current = true;
    setStatus("loading");
    track("long_form_submit", { source });

    try {
      const result = await submitConsultationLead({ data: parsed.data });
      if (result.ok) {
        setStatus("success");
        setValues(EMPTY);
        track("long_form_success", { source });
      } else {
        setStatus("idle");
        setErrors({ form: result.error });
      }
    } catch {
      setStatus("idle");
      setErrors({
        form: "We couldn't send your request just now. Please try again, or reach us on WhatsApp.",
      });
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold">Consultation request received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you. We'll review your brief and reply within one business day with next steps.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setStatus("idle")}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass relative space-y-8 rounded-2xl p-6 sm:p-8">
      <Honeypot value={hp} onChange={setHp} />

      <Fieldset legend="Personal">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="lf-fullName"
            label="Full name"
            autoComplete="name"
            value={values.fullName}
            error={errors.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          <TextField
            id="lf-workEmail"
            label="Work email"
            type="email"
            autoComplete="email"
            value={values.workEmail}
            error={errors.workEmail}
            onChange={(e) => set("workEmail", e.target.value)}
          />
          <TextField
            id="lf-phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <TextField
            id="lf-company"
            label="Company"
            autoComplete="organization"
            value={values.company}
            error={errors.company}
            onChange={(e) => set("company", e.target.value)}
          />
          <TextField
            id="lf-jobTitle"
            label="Job title"
            autoComplete="organization-title"
            value={values.jobTitle}
            error={errors.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            className="sm:col-span-2"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Business">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="lf-industry"
            label="Industry"
            value={values.industry}
            error={errors.industry}
            onChange={(e) => set("industry", e.target.value)}
          />
          <SelectField
            id="lf-companySize"
            label="Company size"
            options={COMPANY_SIZES}
            placeholder="Select size"
            value={values.companySize}
            error={errors.companySize}
            onChange={(e) => set("companySize", e.target.value)}
          />
          <TextField
            id="lf-website"
            label="Website"
            optional
            placeholder="company.com"
            value={values.website}
            error={errors.website}
            onChange={(e) => set("website", e.target.value)}
            className="sm:col-span-2"
          />
        </div>
      </Fieldset>

      <Fieldset legend="Challenge">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="lf-primaryChallenge"
            label="Primary challenge"
            options={PRIMARY_CHALLENGES}
            placeholder="Select a challenge"
            value={values.primaryChallenge}
            error={errors.primaryChallenge}
            onChange={(e) => set("primaryChallenge", e.target.value)}
          />
          <SelectField
            id="lf-existingAIUsage"
            label="Existing AI usage"
            options={AI_USAGE_LEVELS}
            placeholder="Select a level"
            value={values.existingAIUsage}
            error={errors.existingAIUsage}
            onChange={(e) => set("existingAIUsage", e.target.value)}
          />
        </div>
        <TextAreaField
          id="lf-currentChallenge"
          label="Describe the current challenge"
          rows={4}
          value={values.currentChallenge}
          error={errors.currentChallenge}
          onChange={(e) => set("currentChallenge", e.target.value)}
        />
        <TextAreaField
          id="lf-desiredOutcome"
          label="Desired outcome"
          rows={3}
          value={values.desiredOutcome}
          error={errors.desiredOutcome}
          onChange={(e) => set("desiredOutcome", e.target.value)}
        />
        <TextAreaField
          id="lf-currentTools"
          label="Current tools and systems"
          optional
          rows={2}
          value={values.currentTools}
          error={errors.currentTools}
          onChange={(e) => set("currentTools", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            id="lf-projectScope"
            label="Project scope"
            options={PROJECT_SCOPES}
            placeholder="Select scope"
            value={values.projectScope}
            error={errors.projectScope}
            onChange={(e) => set("projectScope", e.target.value)}
          />
          <SelectField
            id="lf-budgetRange"
            label="Budget range"
            options={BUDGET_RANGES}
            placeholder="Select range"
            value={values.budgetRange}
            error={errors.budgetRange}
            onChange={(e) => set("budgetRange", e.target.value)}
          />
          <SelectField
            id="lf-preferredContactTime"
            label="Preferred contact time"
            options={CONTACT_TIMES}
            placeholder="Select time"
            value={values.preferredContactTime}
            error={errors.preferredContactTime}
            onChange={(e) => set("preferredContactTime", e.target.value)}
          />
        </div>
      </Fieldset>

      {errors.form ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {errors.form}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="block" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Request a Strategy Consultation"
        )}
      </Button>
    </form>
  );
}

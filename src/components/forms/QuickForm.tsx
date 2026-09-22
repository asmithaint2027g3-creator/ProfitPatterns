import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Honeypot, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { track } from "@/lib/analytics";
import { quickLeadSchema } from "@/lib/leads";
import { submitQuickLead } from "@/lib/leads.functions";

const REQUIREMENTS = [
  "AI Strategy",
  "Business Automation",
  "Data & Analytics",
  "Process Optimization",
  "Digital Transformation",
  "Profit & Growth Strategy",
  "Not sure yet",
] as const;

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  requirement: "",
  message: "",
};

type Errors = Partial<Record<keyof typeof EMPTY | "form", string>>;

export function QuickForm({ source = "quick_form" }: { source?: string }) {
  const [values, setValues] = useState(EMPTY);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const submitting = useRef(false);

  useEffect(() => {
    track("quick_form_open", { source });
  }, [source]);

  function set(field: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => { const next = { ...e }; delete next[field]; delete next.form; return next; });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;

    const page = typeof window !== "undefined" ? window.location.pathname : "/";
    const parsed = quickLeadSchema.safeParse({
      ...values,
      companyWebsiteHp: hp,
      page,
      source,
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof EMPTY;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    submitting.current = true;
    setStatus("loading");
    track("quick_form_submit", { source });

    try {
      const result = await submitQuickLead({ data: parsed.data });
      if (result.ok) {
        setStatus("success");
        setValues(EMPTY);
        track("quick_form_success", { source });
      } else {
        setStatus("idle");
        setErrors({ form: result.error });
      }
    } catch {
      setStatus("idle");
      setErrors({
        form: "We couldn't send your message just now. Please try again, or reach us on WhatsApp.",
      });
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="glass rounded-2xl p-8 text-center"
      >
        <CheckCircle2 className="mx-auto size-10 text-accent" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold">Message received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you. We'll be in touch within one business day.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass relative space-y-4 rounded-2xl p-6">
      <Honeypot value={hp} onChange={setHp} />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="qf-name"
          label="Name"
          autoComplete="name"
          placeholder="Your name"
          value={values.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          id="qf-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          error={errors.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <TextField
          id="qf-phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 555 000 0000"
          value={values.phone}
          error={errors.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <TextField
          id="qf-company"
          label="Company"
          autoComplete="organization"
          placeholder="Company name"
          value={values.company}
          error={errors.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      <SelectField
        id="qf-requirement"
        label="What do you need help with?"
        options={REQUIREMENTS}
        placeholder="Select an area"
        value={values.requirement}
        error={errors.requirement}
        onChange={(e) => set("requirement", e.target.value)}
      />

      <TextAreaField
        id="qf-message"
        label="Message"
        rows={4}
        placeholder="A sentence or two about what you're trying to improve."
        value={values.message}
        error={errors.message}
        onChange={(e) => set("message", e.target.value)}
      />

      {errors.form ? (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {errors.form}
        </p>
      ) : null}

      <Button type="submit" variant="accent" size="block" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Get Started"
        )}
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        No spam. We respond within one business day.
      </p>
    </form>
  );
}

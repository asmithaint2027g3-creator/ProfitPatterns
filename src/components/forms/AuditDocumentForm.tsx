import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Lock,
  Paperclip,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Honeypot, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { track } from "@/lib/analytics";
import {
  AUDIT_DOC_TYPES,
  AUDIT_PRIMARY_GOALS,
  type UploadedFileInfo,
} from "@/lib/leads";
import { submitAuditLead } from "@/lib/leads.functions";
import { trackLead } from "@/utils/analytics";

interface FileEntry extends UploadedFileInfo {
  id: string;
  nativeFile?: File;
}

const EMPTY_VALUES = {
  fullName: "",
  workEmail: "",
  phone: "",
  company: "",
  docType: AUDIT_DOC_TYPES[0] as string,
  primaryGoal: AUDIT_PRIMARY_GOALS[0] as string,
  processSummary: "",
  ndaRequested: true,
};

type FieldKey = keyof typeof EMPTY_VALUES;
type Errors = Partial<Record<FieldKey | "files" | "form", string>>;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AuditDocumentForm({ source = "audit_submission_page" }: { source?: string }) {
  const fileInputId = "as-fileInput-simple";
  const [values, setValues] = useState(EMPTY_VALUES);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const submitting = useRef(false);

  useEffect(() => {
    track("audit_form_open", { source });
  }, [source]);

  function set(field: FieldKey, value: string | boolean) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      delete next.form;
      return next;
    });
  }

  function handleFileAdd(newFiles: FileList | File[]) {
    const dangerousExtensions = ["exe", "bat", "cmd", "sh", "dll", "vbs", "msi"];
    const added: FileEntry[] = [];
    let fileError = "";

    Array.from(newFiles).forEach((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (ext && dangerousExtensions.includes(ext)) {
        fileError = `Executable files (.${ext}) are not permitted. Please upload PDFs, spreadsheets, documents, or text files.`;
        return;
      }
      if (f.size > 30 * 1024 * 1024) {
        fileError = `File "${f.name}" exceeds 30MB size limit.`;
        return;
      }
      added.push({
        id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        nativeFile: f,
      });
    });

    if (fileError) {
      setErrors((prev) => ({ ...prev, files: fileError }));
      return;
    }

    if (added.length > 0) {
      setFiles((prev) => [...prev, ...added]);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.files;
        return next;
      });
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;

    const nextErrors: Errors = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Please enter your name.";
    if (!values.workEmail.trim() || !values.workEmail.includes("@")) {
      nextErrors.workEmail = "Please enter a valid work email.";
    }
    if (!values.company.trim()) nextErrors.company = "Please enter your company name.";
    if (files.length === 0) {
      nextErrors.files = "Please attach at least one document, SOP, or spreadsheet for the audit.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    submitting.current = true;
    setStatus("loading");

    const generatedRef = `PP-AUDIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedRef);

    // Convert first attached file to base64 for automated Drive archival
    let fileBase64 = "";
    let fileName = "";
    let fileMimeType = "";
    if (files.length > 0 && files[0]?.nativeFile) {
      const f = files[0].nativeFile;
      fileName = f.name;
      fileMimeType = f.type || "application/pdf";
      try {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("File read error"));
          reader.readAsDataURL(f);
        });
      } catch (err) {
        console.warn("Could not encode file as base64:", err);
      }
    }

    // Record lead
    trackLead({
      fullName: values.fullName,
      workEmail: values.workEmail,
      phone: values.phone || "",
      company: values.company,
      requirement: `Process AI Audit: ${values.primaryGoal}`,
      challenge: values.processSummary || "Standard workflow audit request",
      form_name: "Process AI Audit Document Submission",
      source: source || "audit_submission",
      fileBase64,
      fileName,
      fileMimeType,
      docType: values.docType,
      referenceId: generatedRef,
    });

    try {
      await submitAuditLead({
        data: {
          fullName: values.fullName,
          workEmail: values.workEmail,
          phone: values.phone || "",
          company: values.company,
          jobTitle: "Executive Lead",
          industry: "General Enterprise",
          docType: values.docType,
          weeklyHoursSpent: "10-20 hrs/week",
          primaryGoal: values.primaryGoal,
          processSummary: values.processSummary || "Workflow document provided for feasibility audit.",
          files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
          ndaRequested: values.ndaRequested,
          source: source || "audit_submission",
          page: typeof window !== "undefined" ? window.location.pathname : "/audit-submission",
        },
      });
    } catch (err) {
      console.warn("ServerFn notice, proceeding to direct lead fallback:", err);
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadType: "Process Audit",
            name: values.fullName,
            email: values.workEmail,
            company: values.company,
            phone: values.phone || "",
            requirement: values.primaryGoal,
            message: values.processSummary || `Audit files: ${files.map((f) => f.name).join(", ")}`,
            source: source || "audit_submission",
          }),
        });
      } catch (fallbackErr) {
        console.warn("Direct fallback error:", fallbackErr);
      }
    }

    setStatus("success");
    submitting.current = false;
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center shadow-xs">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>

        <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F5F2EB] px-3 py-1 text-xs font-semibold text-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Audit Docket:</span>
          <span className="font-mono text-primary font-bold">{referenceId}</span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
          Document Received for Audit
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Thank you, <strong className="text-foreground">{values.fullName}</strong>. Your documents ({files.length} attached) are under confidential review. You will receive an executive feasibility scorecard within 24–48 hours.
        </p>

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([]);
              setValues(EMPTY_VALUES);
              setStatus("idle");
            }}
          >
            Submit Another Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-6 rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs"
    >
      <Honeypot value={hp} onChange={setHp} />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Confidential Intake
          </span>
          <h2 className="mt-1 font-display text-xl font-bold text-foreground">
            Process Document Submission
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Lock className="size-3.5 text-primary" />
          <span>Encrypted • Reviewed Under Mutual NDA</span>
        </div>
      </div>

      {/* Step 1: Easy File Upload */}
      <div>
        <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-primary">
          1. Attach Process Document, SOP, or Sample Data
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFileAdd(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-7 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : errors.files
              ? "border-destructive/60 bg-destructive/5"
              : "border-border hover:border-primary/50 hover:bg-[#F9F7F2]/60"
          }`}
        >
          <input
            id={fileInputId}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.txt,.pptx"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) handleFileAdd(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">
            Drop your documents here, or{" "}
            <label
              htmlFor={fileInputId}
              className="text-primary hover:underline cursor-pointer font-bold"
            >
              browse from computer
            </label>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports PDF, Excel (.xlsx, .csv), Word (.docx), Process Diagrams, or Text (up to 30MB)
          </p>
        </div>

        {errors.files ? (
          <p className="mt-2 text-xs font-semibold text-destructive">{errors.files}</p>
        ) : null}

        {/* Attached Files List */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-border bg-[#FBF9F5] px-3.5 py-2 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Paperclip className="size-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground truncate">{file.name}</span>
                  <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  aria-label={`Remove ${file.name}`}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Clear & Easy Filling Fields */}
      <div className="border-t border-border/70 pt-5">
        <p className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-primary">
          2. Contact & Review Objectives
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <TextField
            id="as-fullName"
            label="Your full name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={values.fullName}
            error={errors.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          <TextField
            id="as-workEmail"
            label="Work email (where to send scorecard)"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            value={values.workEmail}
            error={errors.workEmail}
            onChange={(e) => set("workEmail", e.target.value)}
          />
          <TextField
            id="as-company"
            label="Company name"
            autoComplete="organization"
            placeholder="Acme Corp"
            value={values.company}
            error={errors.company}
            onChange={(e) => set("company", e.target.value)}
          />
          <SelectField
            id="as-primaryGoal"
            label="Primary optimization target"
            options={AUDIT_PRIMARY_GOALS}
            value={values.primaryGoal}
            onChange={(e) => set("primaryGoal", e.target.value)}
          />
        </div>

        <div className="mt-3.5">
          <TextAreaField
            id="as-processSummary"
            label="Brief note on this workflow (Optional)"
            rows={2}
            placeholder="e.g. This invoice reconciliation takes 20 hours per week and has errors during month-end close."
            value={values.processSummary}
            onChange={(e) => set("processSummary", e.target.value)}
          />
        </div>
      </div>

      {/* Mutual NDA & Confidentiality Checkbox */}
      <div className="rounded-lg border border-border/70 bg-[#F9F7F2] p-3 flex items-start gap-2.5">
        <input
          id="as-nda"
          type="checkbox"
          checked={values.ndaRequested}
          onChange={(e) => set("ndaRequested", e.target.checked)}
          className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
        />
        <label htmlFor="as-nda" className="text-xs text-foreground/90 cursor-pointer">
          <span className="font-semibold text-foreground">Standard Mutual Non-Disclosure Agreement:</span> All documents and workflow descriptions are handled with strict executive confidentiality and will never be shared or used to train public models.
        </label>
      </div>

      {errors.form ? (
        <p role="alert" className="rounded border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
          {errors.form}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full text-base font-semibold"
      >
        {status === "loading" ? "Submitting for Audit…" : "Submit Document for Confidential Audit →"}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        Fast turnaround: Expect your initial executive automation evaluation within 24–48 hours.
      </p>
    </form>
  );
}

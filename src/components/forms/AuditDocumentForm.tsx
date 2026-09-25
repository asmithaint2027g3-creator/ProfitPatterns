import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Loader2,
  Lock,
  Paperclip,
  ShieldCheck,
  Sparkles,
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
  ESTIMATED_WEEKLY_HOURS,
  type UploadedFileInfo,
} from "@/lib/leads";
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
  jobTitle: "",
  industry: "",
  docType: AUDIT_DOC_TYPES[0] as string,
  weeklyHoursSpent: ESTIMATED_WEEKLY_HOURS[1] as string,
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

function getFileIcon(fileName: string, mimeType: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || mimeType.includes("pdf")) {
    return <FileText className="size-5 text-red-500 shrink-0" />;
  }
  if (["xls", "xlsx", "csv"].includes(ext || "") || mimeType.includes("sheet") || mimeType.includes("csv")) {
    return <FileSpreadsheet className="size-5 text-emerald-600 shrink-0" />;
  }
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext || "") || mimeType.includes("image")) {
    return <ImageIcon className="size-5 text-blue-500 shrink-0" />;
  }
  return <FileCheck2 className="size-5 text-primary shrink-0" />;
}

export function AuditDocumentForm({ source = "audit_submission_page" }: { source?: string }) {
  const fileInputId = "as-fileInput";
  const formRef = useRef<HTMLFormElement>(null);
  const fileZoneRef = useRef<HTMLFieldSetElement>(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [submitBanner, setSubmitBanner] = useState<string | null>(null);
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

  // Calculate readiness meter score
  const hasFiles = files.length > 0;
  const hasContact = values.fullName.trim().length > 1 && values.workEmail.includes("@") && values.company.trim().length > 1;
  const hasContext = values.processSummary.trim().length >= 15;
  const readinessScore = (hasFiles ? 40 : 0) + (hasContact ? 35 : 0) + (hasContext ? 25 : 0);

  function handleFileAdd(newFiles: FileList | File[]) {
    const dangerousExtensions = ["exe", "bat", "cmd", "sh", "dll", "vbs", "msi", "bin", "com", "scr"];
    const added: FileEntry[] = [];
    let fileError = "";

    Array.from(newFiles).forEach((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (ext && dangerousExtensions.includes(ext)) {
        fileError = `Executable files (.${ext}) are not permitted. Please upload documents, text files, PDFs, spreadsheets, or images.`;
        return;
      }
      if (f.size > 35 * 1024 * 1024) {
        fileError = `File "${f.name}" exceeds the 35MB size limit.`;
        return;
      }

      added.push({
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        category: values.docType,
        nativeFile: f,
      });
    });

    if (fileError) {
      setErrors((prev) => ({ ...prev, files: fileError }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.files;
        return next;
      });
    }

    if (added.length > 0) {
      setFiles((prev) => [...prev, ...added]);
      try {
        track("audit_file_uploaded", { count: added.length });
      } catch {
        /* non-blocking */
      }
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function updateFileCategory(id: string, category: string) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, category } : f))
    );
  }

  function scrollToFileZone() {
    fileZoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    setSubmitBanner(null);
    setErrors({});

    // --- Validate: files required ---
    if (files.length === 0) {
      setErrors({ files: "Please attach at least one document or workflow specification for review." });
      setSubmitBanner("📎 No document attached — please upload at least one file before submitting.");
      scrollToFileZone();
      return;
    }

    // --- Validate: work email required ---
    const emailVal = values.workEmail.trim();
    if (!emailVal || !emailVal.includes("@") || !emailVal.includes(".")) {
      setErrors({ workEmail: "Please provide a valid work email so we can deliver your audit scorecard." });
      setSubmitBanner("✉️ Please enter a valid work email address.");
      document.getElementById("as-workEmail")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("as-workEmail")?.focus();
      return;
    }

    // --- All good: proceed to success ---
    submitting.current = true;
    setStatus("loading");

    const page = typeof window !== "undefined" ? window.location.pathname : "/audit-submission";
    const fullName  = values.fullName.trim()  || "Enterprise Partner";
    const company   = values.company.trim()   || "Enterprise Client";
    const jobTitle  = values.jobTitle.trim()  || "Operations / Strategic Lead";
    const industry  = values.industry.trim()  || "Business & Operations";
    const processSummary =
      values.processSummary.trim() ||
      `Workflow and process specifications detailed in attached document (${files[0]?.name || "Attached Spec"}).`;

    // Generate unique audit reference
    const generatedRef = `PP-AUDIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedRef);

    // Fire analytics (non-blocking)
    try {
      track("audit_form_submit", {
        source,
        filesCount: files.length,
        docType: values.docType,
        primaryGoal: values.primaryGoal,
      });
    } catch { /* ignore */ }

    // Send lead to CRM (non-blocking)
    try {
      trackLead({
        fullName,
        workEmail: emailVal,
        phone: values.phone.trim(),
        company,
        requirement: `AI Process Audit: ${values.docType}`,
        challenge: processSummary,
        desired_outcome: values.primaryGoal,
        form_name: "Process AI Audit Document Submission",
        source: source || "audit_submission",
      });
    } catch { /* non-blocking */ }

    setStatus("success");

    try {
      track("audit_form_success", { source, referenceId: generatedRef });
    } catch { /* ignore */ }

    submitting.current = false;
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg text-center animate-in fade-in duration-300">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-[#F4F1EA] px-3.5 py-1 text-xs font-semibold text-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Confidential Intake Active</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-mono text-primary">{referenceId}</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Process Audit Dossier Received
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Thank you, <strong className="text-foreground">{values.fullName}</strong>. Your documentation ({files.length} {files.length === 1 ? "file" : "files"}) has been securely logged for review by our Senior AI Strategy Practice.
        </p>

        {/* Milestone Steps */}
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-border/80 bg-background/60 p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
            <h4 className="mt-2 text-xs font-bold text-foreground uppercase tracking-wider">Document Security</h4>
            <p className="mt-1 text-xs text-muted-foreground">Your files are encrypted and shared exclusively with senior partners under mutual NDA.</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/60 p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
            <h4 className="mt-2 text-xs font-bold text-foreground uppercase tracking-wider">Feasibility Scan</h4>
            <p className="mt-1 text-xs text-muted-foreground">We assess manual overhead, bottlenecks, and pinpoint automation candidates.</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/60 p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
            <h4 className="mt-2 text-xs font-bold text-foreground uppercase tracking-wider">Scorecard Delivery</h4>
            <p className="mt-1 text-xs text-muted-foreground">Receive your executive report & preliminary ROI projection within 24–48 hours.</p>
          </div>
        </div>

        {/* Uploaded Files Summary */}
        <div className="mt-6 rounded-lg border border-border bg-[#F9F7F2] p-4 text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submitted Attachments</p>
          <ul className="mt-2 divide-y divide-border/60 text-xs text-foreground">
            {files.map((file) => (
              <li key={file.id} className="flex items-center justify-between py-2">
                <span className="font-medium truncate max-w-xs">{file.name}</span>
                <span className="text-muted-foreground ml-2">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setFiles([]);
              setValues(EMPTY_VALUES);
              setStatus("idle");
            }}
          >
            Submit Another Process Spec
          </Button>
          <Button
            asChild
            variant="primary"
            size="md"
            className="bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D]"
          >
            <a href="/contact">
              Fast-Track via Consultation <ArrowRight className="ml-1.5 size-4" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <Honeypot value={hp} onChange={setHp} />

      {/* Dynamic Readiness Meter */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Audit Readiness Score
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-primary">{readinessScore}% Complete</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${readinessScore}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className={hasFiles ? "text-primary font-semibold" : ""}>
            {hasFiles ? "✓ Document attached" : "○ Attach document"}
          </span>
          <span className={hasContact ? "text-primary font-semibold" : ""}>
            {hasContact ? "✓ Contact verified" : "○ Add contact details"}
          </span>
          <span className={hasContext ? "text-primary font-semibold" : ""}>
            {hasContext ? "✓ Context provided" : "○ Workflow details"}
          </span>
        </div>
      </div>

      {/* SECTION 1: Document Upload */}
      <fieldset ref={fileZoneRef} className="space-y-4">
        <legend className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-accent">
          <span>1. Document & Process Attachments</span>
          <span className="font-normal lowercase text-muted-foreground">up to 25MB per file</span>
        </legend>

        {/* Dropzone */}
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
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : errors.files
              ? "border-destructive/60 bg-destructive/5"
              : "border-border hover:border-primary/50 hover:bg-[#F8F6F0]"
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

          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>

          <p className="mt-3 text-sm font-semibold text-foreground">
            Drag & drop your files here, or{" "}
            <label
              htmlFor={fileInputId}
              className="cursor-pointer text-primary underline underline-offset-4 hover:text-primary/80"
            >
              browse from computer
            </label>
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Supported formats: PDF, Word (DOCX), Excel/CSV, Flowcharts (PNG/JPG), Presentation (PPTX)
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#EFECE6] px-2 py-0.5 text-[11px] font-medium text-foreground">
              <FileText className="size-3 text-red-500" /> SOPs
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#EFECE6] px-2 py-0.5 text-[11px] font-medium text-foreground">
              <FileSpreadsheet className="size-3 text-emerald-600" /> Excel / CSV Logs
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#EFECE6] px-2 py-0.5 text-[11px] font-medium text-foreground">
              <ImageIcon className="size-3 text-blue-500" /> Workflow Diagrams
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#EFECE6] px-2 py-0.5 text-[11px] font-medium text-foreground">
              <Paperclip className="size-3 text-amber-600" /> RFPs / Specs
            </span>
          </div>
        </div>

        {/* 1-Click Sample Document Bar */}
        <div className="rounded-lg border border-border/80 bg-[#F9F7F2] p-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Need a test document to try the upload?
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  fetch("/sample-documents/Customer_Support_Triage_and_Escalation_Runbook.txt")
                    .then((r) => r.text())
                    .then((text) => {
                      const file = new File([text], "Customer_Support_Triage_and_Escalation_Runbook.txt", { type: "text/plain" });
                      handleFileAdd([file]);
                      setValues((v) => ({
                        ...v,
                        fullName: v.fullName || "Customer Ops Director",
                        workEmail: v.workEmail || "ops@company.com",
                        company: v.company || "Global Support Logistics",
                        docType: "Process Workflow Diagram / Map",
                        weeklyHoursSpent: "15 – 40 hours / week",
                        primaryGoal: "Accelerate Turnaround Time for Customers",
                        processSummary: "Manual triage, sentiment evaluation, and urgency assignment for 1,400+ weekly customer support tickets across Zendesk and Jira.",
                      }));
                    });
                }}
                className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Sparkles className="size-3" />
                Load Support Runbook (Test File)
              </button>

              <button
                type="button"
                onClick={() => {
                  fetch("/sample-documents/SOP_Accounts_Payable_Invoice_Matching.txt")
                    .then((r) => r.text())
                    .then((text) => {
                      const file = new File([text], "SOP_Accounts_Payable_Invoice_Matching.txt", { type: "text/plain" });
                      handleFileAdd([file]);
                      setValues((v) => ({
                        ...v,
                        fullName: v.fullName || "Finance Lead",
                        workEmail: v.workEmail || "finance@company.com",
                        company: v.company || "Enterprise Corp",
                        docType: "Standard Operating Procedure (SOP)",
                        weeklyHoursSpent: "15 – 40 hours / week",
                        primaryGoal: "Eliminate Manual Data Entry & Human Bottlenecks",
                        processSummary: "Manual line-item matching of vendor PDF invoices against POs in NetSuite and Excel tracking. Takes ~35 hrs/wk with a 4.8% error rate.",
                      }));
                    });
                }}
                className="inline-flex items-center gap-1 rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <FileText className="size-3 text-red-500" />
                Load Sample SOP
              </button>

              <button
                type="button"
                onClick={() => {
                  fetch("/sample-documents/Operations_Process_Bottleneck_Audit_Log.csv")
                    .then((r) => r.text())
                    .then((text) => {
                      const file = new File([text], "Operations_Process_Bottleneck_Audit_Log.csv", { type: "text/csv" });
                      handleFileAdd([file]);
                      setValues((v) => ({
                        ...v,
                        fullName: v.fullName || "VP Operations",
                        workEmail: v.workEmail || "coo@company.com",
                        company: v.company || "Mid-Market Enterprise",
                        docType: "Operational Data / Metrics Spreadsheet",
                        weeklyHoursSpent: "40+ hours / week (team-wide)",
                        primaryGoal: "Identify High-ROI Automation Opportunities",
                        processSummary: "Departmental manual overhead log across AP, Customer Support, Logistics, and CRM enrichment.",
                      }));
                    });
                }}
                className="inline-flex items-center gap-1 rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="size-3 text-emerald-600" />
                Load Sample CSV
              </button>

              <a
                href="/sample-documents/Customer_Support_Triage_and_Escalation_Runbook.txt"
                download="Customer_Support_Triage_and_Escalation_Runbook.txt"
                className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                title="Download Runbook file to your computer"
              >
                Download Runbook (.txt)
              </a>
            </div>
          </div>
        </div>

        {errors.files && (
          <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
            <AlertCircle className="size-3.5 shrink-0" />
            {errors.files}
          </p>
        )}

        {/* Uploaded File List */}
        {files.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attached Files ({files.length})
            </p>
            <div className="divide-y divide-border rounded-lg border border-border bg-background">
              {files.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(file.name, file.type)}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-sm">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      value={file.category || values.docType}
                      onChange={(e) => updateFileCategory(file.id, e.target.value)}
                      className="rounded border border-border bg-card px-2 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label="Document Category"
                    >
                      {AUDIT_DOC_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Remove file"
                      aria-label="Remove file"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      {/* SECTION 2: Process Scoping & Bottlenecks */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          2. Operational Scoping & Impact Target
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="as-docType"
            label="Primary Document Type"
            value={values.docType}
            options={AUDIT_DOC_TYPES}
            onChange={(e) => set("docType", e.target.value)}
            error={errors.docType}
          />

          <SelectField
            id="as-weeklyHoursSpent"
            label="Estimated Manual Hours Spent Weekly"
            value={values.weeklyHoursSpent}
            options={ESTIMATED_WEEKLY_HOURS}
            onChange={(e) => set("weeklyHoursSpent", e.target.value)}
            error={errors.weeklyHoursSpent}
          />
        </div>

        <SelectField
          id="as-primaryGoal"
          label="Primary Automation / Audit Objective"
          value={values.primaryGoal}
          options={AUDIT_PRIMARY_GOALS}
          onChange={(e) => set("primaryGoal", e.target.value)}
          error={errors.primaryGoal}
        />

        <TextAreaField
          id="as-processSummary"
          label="Process Summary & Current Bottleneck"
          placeholder="e.g., We manually extract line items from vendor invoices, cross-check them against ERP records, and copy details into spreadsheets. Takes our ops team ~25 hrs/week and causes a 4% error rate."
          value={values.processSummary}
          rows={3}
          onChange={(e) => set("processSummary", e.target.value)}
          error={errors.processSummary}
        />
        <p className="-mt-2 text-[11px] text-muted-foreground">Briefly describe what your team currently does manually and where the friction occurs.</p>
      </fieldset>

      {/* SECTION 3: Organization & Contact Details */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          3. Deliver Scorecard To
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="as-fullName"
            label="Full Name"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            error={errors.fullName}
          />

          <TextField
            id="as-workEmail"
            type="email"
            label="Work Email"
            autoComplete="email"
            value={values.workEmail}
            onChange={(e) => set("workEmail", e.target.value)}
            error={errors.workEmail}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="as-company"
            label="Company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            error={errors.company}
          />

          <TextField
            id="as-jobTitle"
            label="Job Title"
            autoComplete="organization-title"
            value={values.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            error={errors.jobTitle}
          />

          <TextField
            id="as-industry"
            label="Industry / Domain"
            placeholder="e.g., Logistics, FinTech, Healthcare"
            value={values.industry}
            onChange={(e) => set("industry", e.target.value)}
            error={errors.industry}
          />
        </div>

        <TextField
          id="as-phone"
          type="tel"
          label="Phone Number (Optional)"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
        />
        <p className="-mt-2 text-[11px] text-muted-foreground">If you&apos;d like an advisory call or WhatsApp update.</p>
      </fieldset>

      {/* Confidentiality & NDA Guarantee */}
      <div className="rounded-xl border border-border bg-[#FBF9F5] p-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Lock className="size-4" />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground">
              <input
                type="checkbox"
                checked={values.ndaRequested}
                onChange={(e) => set("ndaRequested", e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Apply Mutual Non-Disclosure Agreement (NDA) & Enterprise Confidentiality</span>
            </label>
            <p className="mt-1 text-muted-foreground leading-relaxed">
              We treat all workflows, documents, and data with strict institutional discretion. No customer document is ever used to train public models. We will provide our standard countersigned mutual NDA upon request.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Error Banner */}
      {submitBanner && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive animate-in slide-in-from-bottom-2 duration-300"
        >
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Cannot Submit Yet</p>
            <p className="mt-0.5 text-xs font-normal text-destructive/80">{submitBanner}</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitBanner(null)}
            className="text-destructive/60 hover:text-destructive transition-colors text-lg leading-none ml-2"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      {hasErrors && !submitBanner && (
        <div className="rounded-lg border border-amber-300/60 bg-amber-50/80 px-4 py-3 text-xs text-amber-800">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="size-3.5" /> Please fix the highlighted fields above before submitting.
          </p>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Turnaround: 24–48 hours by Senior Partners</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "loading"}
          className="w-full sm:w-auto bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D] px-8 cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Analyzing & Submitting...
            </>
          ) : (
            <>
              Submit for AI Feasibility Audit
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

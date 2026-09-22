import * as React from "react";

import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-lg bg-background/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-60";

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean | undefined;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground"
    >
      {children}
      {optional ? <span className="ml-1 normal-case tracking-normal">(optional)</span> : null}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

interface BaseProps {
  id: string;
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
  className?: string | undefined;
}

export function TextField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, error && "border-destructive")}
        {...props}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "resize-y", error && "border-destructive")}
        {...props}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  optional,
  className,
  options,
  placeholder,
  ...props
}: BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly string[];
    placeholder?: string;
  }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, error && "border-destructive")}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Invisible anti-spam field. Screen readers and keyboards skip it. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="companyWebsiteHp">Company website</label>
      <input
        id="companyWebsiteHp"
        name="companyWebsiteHp"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

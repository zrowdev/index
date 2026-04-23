"use client";

import { useId, useState, type FormEvent } from "react";
import { parseWaitlistInput } from "@/lib/waitlist/schema";
import type { WaitlistErrors, WaitlistInput } from "@/lib/waitlist/types";

const createInitialForm = (): WaitlistInput => ({
  name: "",
  email: "",
  role: "",
  useCase: "",
  contact: "",
  referral: "",
});

const inputBaseClass =
  "mt-1 h-11 w-full rounded-md border bg-transparent px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10";

const textAreaBaseClass =
  "mt-1 min-h-36 w-full rounded-md border bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10";

const labelClass = "text-sm font-medium text-white/80";
const errorClass = "text-xs leading-5 text-rose-300";
const helperClass = "text-xs leading-5 text-white/40";
const submitClass =
  "inline-flex h-11 w-full items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

type ServerErrorBody = {
  message?: unknown;
  errors?: Partial<Record<keyof WaitlistInput, string>>;
};

async function readServerError(response: Response): Promise<ServerErrorBody | null> {
  try {
    return (await response.json()) as ServerErrorBody;
  } catch {
    return null;
  }
}

function borderClass(hasError: boolean) {
  return hasError ? "border-rose-400/50" : "border-white/10";
}

export function WaitlistForm() {
  const formId = useId();
  const [values, setValues] = useState<WaitlistInput>(() => createInitialForm());
  const [fieldErrors, setFieldErrors] = useState<WaitlistErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const ids = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    role: `${formId}-role`,
    useCase: `${formId}-use-case`,
    useCaseHint: `${formId}-use-case-help`,
    contact: `${formId}-contact`,
    referral: `${formId}-referral`,
  } as const;

  const focusFirstInvalidField = (errors: WaitlistErrors) => {
    const firstInvalidKey = (
      ["name", "email", "role", "useCase", "contact", "referral"] as const
    ).find((key) => Boolean(errors[key]));

    if (!firstInvalidKey) {
      return;
    }

    const idMap: Record<keyof WaitlistInput, string> = {
      name: ids.name,
      email: ids.email,
      role: ids.role,
      useCase: ids.useCase,
      contact: ids.contact,
      referral: ids.referral,
    };

    globalThis.requestAnimationFrame(() => {
      document.getElementById(idMap[firstInvalidKey])?.focus();
    });
  };

  const updateField = (key: keyof WaitlistInput, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setSubmitError(null);

    const parsed = parseWaitlistInput(values);

    if (!parsed.ok) {
      setFieldErrors(parsed.errors);
      setStatus("idle");
      focusFirstInvalidField(parsed.errors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const response = await globalThis.fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = await readServerError(response);

        if (body?.errors) {
          setFieldErrors(body.errors);
          focusFirstInvalidField(body.errors);
        }

        setSubmitError(
          typeof body?.message === "string" && body.message.trim()
            ? body.message
            : "We could not submit your application. Please try again.",
        );
        setStatus("idle");
        return;
      }

      setValues(createInitialForm());
      setStatus("success");
    } catch {
      setSubmitError("We could not submit your application. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
      >
        <p className="text-sm font-medium text-white">Application received.</p>
        <p className="mt-3 text-sm leading-7 text-white/70">
          We review waitlist requests manually and will follow up if there is a fit.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      {submitError ? (
        <div
          role="alert"
          className="mb-5 border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-sm leading-6 text-rose-200"
        >
          {submitError}
        </div>
      ) : null}

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
        <div>
          <label htmlFor={ids.name} className={labelClass}>
            Name
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            spellCheck={false}
            required
            className={`${inputBaseClass} ${borderClass(Boolean(fieldErrors.name))}`}
            value={values.name}
            onChange={(event) => updateField("name", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? `${ids.name}-error` : undefined}
          />
          {fieldErrors.name ? (
            <p id={`${ids.name}-error`} className={errorClass}>
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.email} className={labelClass}>
            Email
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            className={`${inputBaseClass} ${borderClass(Boolean(fieldErrors.email))}`}
            value={values.email}
            onChange={(event) => updateField("email", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? `${ids.email}-error` : undefined}
          />
          {fieldErrors.email ? (
            <p id={`${ids.email}-error`} className={errorClass}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.role} className={labelClass}>
            Role
          </label>
          <input
            id={ids.role}
            name="role"
            type="text"
            autoComplete="organization-title"
            autoCapitalize="words"
            spellCheck={false}
            required
            className={`${inputBaseClass} ${borderClass(Boolean(fieldErrors.role))}`}
            value={values.role}
            onChange={(event) => updateField("role", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.role)}
            aria-describedby={fieldErrors.role ? `${ids.role}-error` : undefined}
          />
          {fieldErrors.role ? (
            <p id={`${ids.role}-error`} className={errorClass}>
              {fieldErrors.role}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.useCase} className={labelClass}>
            Use case
          </label>
          <textarea
            id={ids.useCase}
            name="useCase"
            rows={5}
            minLength={20}
            required
            className={`${textAreaBaseClass} ${borderClass(Boolean(fieldErrors.useCase))}`}
            value={values.useCase}
            onChange={(event) => updateField("useCase", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.useCase)}
            aria-describedby={fieldErrors.useCase ? `${ids.useCase}-error` : ids.useCaseHint}
          />
          {fieldErrors.useCase ? (
            <p id={`${ids.useCase}-error`} className={errorClass}>
              {fieldErrors.useCase}
            </p>
          ) : (
            <p id={ids.useCaseHint} className={helperClass}>
              Tell us what you would use Zrow for.
            </p>
          )}
        </div>

        <div>
          <label htmlFor={ids.contact} className={labelClass}>
            Contact handle
          </label>
          <input
            id={ids.contact}
            name="contact"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            className={`${inputBaseClass} ${borderClass(Boolean(fieldErrors.contact))}`}
            value={values.contact}
            onChange={(event) => updateField("contact", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.contact)}
            aria-describedby={fieldErrors.contact ? `${ids.contact}-error` : undefined}
          />
          {fieldErrors.contact ? (
            <p id={`${ids.contact}-error`} className={errorClass}>
              {fieldErrors.contact}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.referral} className={labelClass}>
            How did you find Zrow?
          </label>
          <input
            id={ids.referral}
            name="referral"
            type="text"
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            required
            className={`${inputBaseClass} ${borderClass(Boolean(fieldErrors.referral))}`}
            value={values.referral}
            onChange={(event) => updateField("referral", event.currentTarget.value)}
            aria-invalid={Boolean(fieldErrors.referral)}
            aria-describedby={fieldErrors.referral ? `${ids.referral}-error` : undefined}
          />
          {fieldErrors.referral ? (
            <p id={`${ids.referral}-error`} className={errorClass}>
              {fieldErrors.referral}
            </p>
          ) : null}
        </div>

        <div className="pt-1">
          <button type="submit" disabled={status === "submitting"} className={submitClass}>
            {status === "submitting" ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

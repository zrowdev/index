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
  "mt-2 h-12 w-full rounded-xl border bg-black/20 px-3.5 text-sm text-white/90 shadow-inner shadow-black/20 outline-none transition placeholder:text-white/25 hover:border-white/20 focus-visible:border-cyan-200/45 focus-visible:ring-2 focus-visible:ring-cyan-200/10";

const textAreaBaseClass =
  "mt-2 min-h-36 w-full resize-y rounded-xl border bg-black/20 px-3.5 py-3 text-sm leading-6 text-white/90 shadow-inner shadow-black/20 outline-none transition placeholder:text-white/25 hover:border-white/20 focus-visible:border-cyan-200/45 focus-visible:ring-2 focus-visible:ring-cyan-200/10";

const labelClass = "text-sm font-medium text-white/80";
const errorClass = "mt-1.5 text-xs leading-5 text-rose-200";
const helperClass = "mt-1.5 text-xs leading-5 text-white/40";
const submitClass =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(255,255,255,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

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
  return hasError ? "border-rose-300/60 bg-rose-300/[0.035]" : "border-white/10";
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
      ["name", "email", "role", "contact", "useCase", "referral"] as const
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
        className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-7"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-semibold text-black">
          ✓
        </div>
        <p className="mt-5 text-base font-semibold text-white">Application received.</p>
        <p className="mt-3 text-sm leading-7 text-white/70">
          We review waitlist requests manually and will follow up if there is a fit.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6 md:p-7">
      {submitError ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-rose-300/25 bg-rose-300/[0.055] px-3.5 py-3 text-sm leading-6 text-rose-100"
        >
          {submitError}
        </div>
      ) : null}

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === "submitting"}
      >
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
            placeholder="Ada Lovelace"
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
            placeholder="ada@company.com"
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
            placeholder="Engineering lead"
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
            placeholder="@ada or ada.dev"
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

        <div className="sm:col-span-2">
          <label htmlFor={ids.useCase} className={labelClass}>
            Use case
          </label>
          <textarea
            id={ids.useCase}
            name="useCase"
            rows={5}
            minLength={20}
            required
            placeholder="Describe the workflow you want to delegate, where it gets risky, and what Zrow should help control."
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

        <div className="sm:col-span-2">
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
            placeholder="Friend, GitHub, X, launch post…"
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

        <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={status === "submitting"} className={submitClass}>
            {status === "submitting" ? "Submitting…" : "Submit Application"}
          </button>
          <p className="text-xs leading-5 text-white/40">
            No mailing list automation. A person reviews every application.
          </p>
        </div>
      </form>
    </div>
  );
}

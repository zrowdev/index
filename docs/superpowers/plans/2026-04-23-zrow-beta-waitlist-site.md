# Zrow Beta Waitlist Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing `index/` Next.js site into a strict, minimal marketing page centered on a beta waitlist, with server-side intake on Vercel Blob and manual invite operations.

**Architecture:** Keep the current `index/` Next.js app and replace the current motion-heavy landing page with smaller marketing components. Add a typed waitlist domain layer, a client form with clear submission states, and a `POST` route handler that validates input and stores one record per applicant in Vercel Blob.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vercel Blob, Vitest, Happy DOM, Testing Library

---

## File Structure

- `index/src/app/layout.tsx` — root metadata and body wrapper
- `index/src/app/page.tsx` — page composition only; no giant inline content blocks
- `index/src/app/globals.css` — site-wide tokens and minimal surface styling
- `index/src/app/api/waitlist/route.ts` — server-side form endpoint
- `index/src/components/marketing/hero.tsx` — primary narrative and CTA
- `index/src/components/marketing/capabilities-section.tsx` — use cases / product benefits
- `index/src/components/marketing/beta-explainer.tsx` — why beta is limited and manual
- `index/src/components/marketing/waitlist-section.tsx` — wraps the form and supporting copy
- `index/src/components/marketing/site-footer.tsx` — restrained footer
- `index/src/components/waitlist/waitlist-form.tsx` — client form, field state, submission handling
- `index/src/lib/marketing/content.ts` — structured copy/content objects to keep page clean
- `index/src/lib/waitlist/schema.ts` — input schema, normalization, typed parser
- `index/src/lib/waitlist/storage.ts` — Vercel Blob persistence and duplicate handling
- `index/src/lib/waitlist/types.ts` — shared types for form data and stored records
- `index/src/lib/waitlist/schema.test.ts` — schema validation tests
- `index/src/components/waitlist/waitlist-form.test.tsx` — client form tests
- `index/src/app/page.test.tsx` — page composition smoke tests
- `index/src/app/api/waitlist/route.test.ts` — route handler tests with mocked storage
- `index/vitest.config.ts` — Vitest config for the site
- `index/vitest.setup.ts` — Testing Library matchers and test setup
- `index/.env.example` — required environment variables for local/dev/Vercel
- `index/README.md` — local run, env, and deploy notes
- `index/package.json` — scripts and dependencies for testing + Blob support

### Task 1: Add Waitlist Domain Types, Test Harness, and Scripts

**Files:**
- Create: `index/vitest.config.ts`
- Create: `index/vitest.setup.ts`
- Create: `index/src/lib/waitlist/types.ts`
- Create: `index/src/lib/waitlist/schema.ts`
- Create: `index/src/lib/waitlist/schema.test.ts`
- Modify: `index/package.json`

- [ ] **Step 1: Write the failing schema test**

```ts
// index/src/lib/waitlist/schema.test.ts
import { describe, expect, it } from "vitest";
import { parseWaitlistInput } from "./schema";

describe("parseWaitlistInput", () => {
  it("returns normalized data for a valid payload", () => {
    const result = parseWaitlistInput({
      name: "  Ada Lovelace  ",
      email: "ADA@example.com ",
      role: "Engineer",
      useCase: "I want to replace IDE/chat context switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.data.name).toBe("Ada Lovelace");
    expect(result.data.email).toBe("ada@example.com");
  });

  it("returns field errors for an invalid payload", () => {
    const result = parseWaitlistInput({
      name: "",
      email: "bad",
      role: "",
      useCase: "short",
      contact: "",
      referral: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected error result");
    expect(result.errors.email).toContain("valid email");
    expect(result.errors.useCase).toContain("at least");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd index && npx vitest run src/lib/waitlist/schema.test.ts`
Expected: FAIL with module-not-found errors for `./schema` or missing Vitest config.

- [ ] **Step 3: Write minimal implementation and test harness**

```ts
// index/vitest.config.ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```ts
// index/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

```ts
// index/src/lib/waitlist/types.ts
export type WaitlistInput = {
  name: string;
  email: string;
  role: string;
  useCase: string;
  contact: string;
  referral: string;
};

export type WaitlistErrors = Partial<Record<keyof WaitlistInput, string>>;

export type ParsedWaitlistInput = WaitlistInput;
```

```ts
// index/src/lib/waitlist/schema.ts
import type {
  ParsedWaitlistInput,
  WaitlistErrors,
  WaitlistInput,
} from "./types";

const MIN_USE_CASE_LENGTH = 20;

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function parseWaitlistInput(
  input: Partial<Record<keyof WaitlistInput, unknown>>,
):
  | { ok: true; data: ParsedWaitlistInput }
  | { ok: false; errors: WaitlistErrors } {
  const data: ParsedWaitlistInput = {
    name: normalize(input.name),
    email: normalize(input.email).toLowerCase(),
    role: normalize(input.role),
    useCase: normalize(input.useCase),
    contact: normalize(input.contact),
    referral: normalize(input.referral),
  };

  const errors: WaitlistErrors = {};

  if (!data.name) errors.name = "Enter your name.";
  if (!isEmail(data.email)) errors.email = "Enter a valid email address.";
  if (!data.role) errors.role = "Tell us your role.";
  if (data.useCase.length < MIN_USE_CASE_LENGTH) {
    errors.useCase = "Tell us more about your use case (at least 20 characters).";
  }
  if (!data.contact) errors.contact = "Add a contact handle.";
  if (!data.referral) errors.referral = "Tell us where you found Zrow.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
```

```json
// index/package.json
{
  "name": "index",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.564.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "happy-dom": "^20.8.9",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd index && npm run test -- src/lib/waitlist/schema.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add index/package.json index/vitest.config.ts index/vitest.setup.ts index/src/lib/waitlist/types.ts index/src/lib/waitlist/schema.ts index/src/lib/waitlist/schema.test.ts
git commit -m "feat: add waitlist schema foundation"
```

### Task 2: Replace the Current Landing Page With a Minimal Marketing Shell

**Files:**
- Create: `index/src/lib/marketing/content.ts`
- Create: `index/src/components/marketing/hero.tsx`
- Create: `index/src/components/marketing/capabilities-section.tsx`
- Create: `index/src/components/marketing/beta-explainer.tsx`
- Create: `index/src/components/marketing/waitlist-section.tsx`
- Create: `index/src/components/marketing/site-footer.tsx`
- Create: `index/src/app/page.test.tsx`
- Modify: `index/src/app/page.tsx`
- Modify: `index/src/app/layout.tsx`
- Modify: `index/src/app/globals.css`
- Modify: `index/package.json`

- [ ] **Step 1: Write the failing page smoke test**

```tsx
// index/src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the core beta funnel copy", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /zrow/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /join beta/i })).toBeInTheDocument();
    expect(screen.getByText(/limited beta/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd index && npm run test -- src/app/page.test.tsx`
Expected: FAIL because the current page does not expose the new copy or structure.

- [ ] **Step 3: Write the new page composition and remove motion-heavy UI**

```ts
// index/src/lib/marketing/content.ts
export const heroContent = {
  eyebrow: "Beta waitlist",
  title: "Zrow keeps AI agents inside your real coding workflow.",
  description:
    "A local-first desktop environment for people who want agent delegation, real tools, and clear control over how automation works.",
  primaryCta: "Join beta",
};

export const capabilityItems = [
  {
    title: "Delegate real work",
    body: "Break larger tasks into bounded sub-agent runs instead of forcing one chat thread to do everything.",
  },
  {
    title: "Keep tools close",
    body: "Work with files, terminal commands, and context in one place instead of juggling tabs and pasted snippets.",
  },
  {
    title: "Control the risk",
    body: "Use explicit approval flows and policies instead of treating every tool call as equally safe.",
  },
];
```

```tsx
// index/src/components/marketing/hero.tsx
import { heroContent } from "@/lib/marketing/content";

export function Hero() {
  return (
    <section className="border-b border-white/10 pb-16">
      <p className="text-sm text-white/55">{heroContent.eyebrow}</p>
      <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
        {heroContent.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
        {heroContent.description}
      </p>
      <a
        href="#waitlist"
        className="mt-10 inline-flex h-11 items-center rounded-md border border-white px-5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
      >
        {heroContent.primaryCta}
      </a>
    </section>
  );
}
```

```tsx
// index/src/components/marketing/capabilities-section.tsx
import { capabilityItems } from "@/lib/marketing/content";

export function CapabilitiesSection() {
  return (
    <section className="grid gap-6 border-b border-white/10 py-16 md:grid-cols-3">
      {capabilityItems.map((item) => (
        <article key={item.title} className="space-y-3 rounded-md border border-white/10 p-6">
          <h2 className="text-lg font-medium text-white">{item.title}</h2>
          <p className="text-sm leading-7 text-white/65">{item.body}</p>
        </article>
      ))}
    </section>
  );
}
```

```tsx
// index/src/components/marketing/beta-explainer.tsx
export function BetaExplainer() {
  return (
    <section className="border-b border-white/10 py-16">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-2xl font-medium text-white">Limited beta, reviewed manually.</h2>
        <p className="text-base leading-8 text-white/70">
          We are keeping the preview small on purpose. Applications are reviewed manually and invites go out in waves based on fit, use case, and timing.
        </p>
      </div>
    </section>
  );
}
```

```tsx
// index/src/components/marketing/waitlist-section.tsx
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-16">
      <div className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-medium text-white">Join the beta waitlist.</h2>
        <p className="text-base leading-8 text-white/70">
          Tell us who you are, how you work, and why you want early access.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}
```

```tsx
// index/src/components/marketing/site-footer.tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 text-sm text-white/45">
      Zrow — beta waitlist
    </footer>
  );
}
```

```tsx
// index/src/app/page.tsx
import { BetaExplainer } from "@/components/marketing/beta-explainer";
import { CapabilitiesSection } from "@/components/marketing/capabilities-section";
import { Hero } from "@/components/marketing/hero";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WaitlistSection } from "@/components/marketing/waitlist-section";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 md:py-12">
      <Hero />
      <CapabilitiesSection />
      <BetaExplainer />
      <WaitlistSection />
      <SiteFooter />
    </main>
  );
}
```

```tsx
// index/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Zrow Beta Waitlist",
  description: "Join the early-access waitlist for Zrow.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

```css
/* index/src/app/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-mono-font, monospace;
}

:root {
  color-scheme: dark;
  --background: #0d0f12;
  --surface: #13161b;
  --border: rgba(255, 255, 255, 0.12);
  --foreground: #f4f5f7;
  --muted: rgba(244, 245, 247, 0.7);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}
```

```json
// index/package.json (dependencies cleanup)
{
  "dependencies": {
    "lucide-react": "^0.564.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd index && npm run test -- src/app/page.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add index/package.json index/src/app/layout.tsx index/src/app/page.tsx index/src/app/globals.css index/src/lib/marketing/content.ts index/src/components/marketing index/src/app/page.test.tsx
git commit -m "feat: redesign site around beta waitlist"
```

### Task 3: Build the Client Waitlist Form UX

**Files:**
- Create: `index/src/components/waitlist/waitlist-form.tsx`
- Create: `index/src/components/waitlist/waitlist-form.test.tsx`
- Modify: `index/src/components/marketing/waitlist-section.tsx`

- [ ] **Step 1: Write the failing form interaction test**

```tsx
// index/src/components/waitlist/waitlist-form.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { WaitlistForm } from "./waitlist-form";

describe("WaitlistForm", () => {
  it("shows client validation before sending", async () => {
    render(<WaitlistForm />);

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("shows success state after a successful submit", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "Engineer" } });
    fireEvent.change(screen.getByLabelText(/use case/i), {
      target: { value: "I want agent workflows inside my editor without tab switching." },
    });
    fireEvent.change(screen.getByLabelText(/contact handle/i), { target: { value: "@ada" } });
    fireEvent.change(screen.getByLabelText(/how did you find zrow/i), { target: { value: "GitHub" } });

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByText(/application received/i)).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd index && npm run test -- src/components/waitlist/waitlist-form.test.tsx`
Expected: FAIL because `WaitlistForm` does not exist yet.

- [ ] **Step 3: Write the form component**

```tsx
// index/src/components/waitlist/waitlist-form.tsx
"use client";

import { useState } from "react";
import { parseWaitlistInput } from "@/lib/waitlist/schema";
import type { WaitlistErrors, WaitlistInput } from "@/lib/waitlist/types";

const initialState: WaitlistInput = {
  name: "",
  email: "",
  role: "",
  useCase: "",
  contact: "",
  referral: "",
};

export function WaitlistForm() {
  const [form, setForm] = useState<WaitlistInput>(initialState);
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const updateField = (key: keyof WaitlistInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseWaitlistInput(form);

    if (!parsed.ok) {
      setErrors(parsed.errors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message ?? "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("Application received. We review every request manually and will follow up if there is a fit.");
    setForm(initialState);
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-white/75">
        <strong className="block text-white">Application received.</strong>
        <p className="mt-2">{message}</p>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit} noValidate>
      {(
        [
          ["name", "Name"],
          ["email", "Email"],
          ["role", "Role"],
          ["contact", "Contact handle"],
          ["referral", "How did you find Zrow?"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="grid gap-2 text-sm text-white/70">
          <span>{label}</span>
          <input
            className="h-11 rounded-md border border-white/10 bg-transparent px-3 text-white outline-none transition focus:border-white/35"
            name={key}
            value={form[key]}
            onChange={(event) => updateField(key, event.target.value)}
          />
          {errors[key] ? <span className="text-xs text-red-300">{errors[key]}</span> : null}
        </label>
      ))}

      <label className="grid gap-2 text-sm text-white/70">
        <span>Use case</span>
        <textarea
          className="min-h-32 rounded-md border border-white/10 bg-transparent px-3 py-3 text-white outline-none transition focus:border-white/35"
          name="useCase"
          value={form.useCase}
          onChange={(event) => updateField("useCase", event.target.value)}
        />
        {errors.useCase ? <span className="text-xs text-red-300">{errors.useCase}</span> : null}
      </label>

      {status === "error" ? <p className="text-sm text-red-300">{message}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 items-center justify-center rounded-md border border-white px-5 text-sm font-medium text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd index && npm run test -- src/components/waitlist/waitlist-form.test.tsx`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add index/src/components/waitlist/waitlist-form.tsx index/src/components/waitlist/waitlist-form.test.tsx index/src/components/marketing/waitlist-section.tsx
git commit -m "feat: add client-side beta waitlist form"
```

### Task 4: Implement the Waitlist API Route and Blob Storage

**Files:**
- Create: `index/src/lib/waitlist/storage.ts`
- Create: `index/src/app/api/waitlist/route.ts`
- Create: `index/src/app/api/waitlist/route.test.ts`
- Create: `index/.env.example`
- Modify: `index/package.json`

- [ ] **Step 1: Write the failing route test**

```ts
// index/src/app/api/waitlist/route.test.ts
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/waitlist/storage", () => ({
  createWaitlistSubmission: vi.fn().mockResolvedValue({ ok: true, duplicate: false }),
}));

describe("POST /api/waitlist", () => {
  it("returns 200 for valid submissions", async () => {
    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "Engineer",
        useCase: "I want agent workflows inside my editor without tab switching.",
        contact: "@ada",
        referral: "GitHub",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
  });

  it("returns 400 for invalid submissions", async () => {
    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd index && npm run test -- src/app/api/waitlist/route.test.ts`
Expected: FAIL because the route and storage layer do not exist.

- [ ] **Step 3: Write the storage layer, env doc, and route**

```ts
// index/src/lib/waitlist/storage.ts
import { createHash } from "node:crypto";
import { head, put } from "@vercel/blob";
import type { ParsedWaitlistInput } from "./types";

export type WaitlistRecord = ParsedWaitlistInput & {
  id: string;
  status: "new" | "reviewed" | "invited" | "hold" | "rejected";
  submittedAt: string;
};

const makeId = (email: string) => createHash("sha256").update(email).digest("hex").slice(0, 16);

export async function createWaitlistSubmission(input: ParsedWaitlistInput) {
  const id = makeId(input.email);
  const pathname = `waitlist/${id}.json`;

  const existing = await head(pathname, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }).catch(() => null);

  if (existing) {
    return { ok: true as const, duplicate: true as const, id };
  }

  const record: WaitlistRecord = {
    ...input,
    id,
    status: "new",
    submittedAt: new Date().toISOString(),
  };

  await put(pathname, JSON.stringify(record, null, 2), {
    access: "private",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: "application/json",
  });

  return { ok: true as const, duplicate: false as const, id };
}
```

```ts
// index/src/app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { parseWaitlistInput } from "@/lib/waitlist/schema";
import { createWaitlistSubmission } from "@/lib/waitlist/storage";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = parseWaitlistInput(raw ?? {});

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errors: parsed.errors },
      { status: 400 },
    );
  }

  try {
    const result = await createWaitlistSubmission(parsed.data);

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      message: result.duplicate
        ? "This email is already on the waitlist."
        : "Application received.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "We could not save your request right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
```

```env
# index/.env.example
BLOB_READ_WRITE_TOKEN=
```

```json
// index/package.json
{
  "dependencies": {
    "@vercel/blob": "^1.1.1",
    "lucide-react": "^0.564.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd index && npm run test -- src/app/api/waitlist/route.test.ts`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add index/package.json index/.env.example index/src/lib/waitlist/storage.ts index/src/app/api/waitlist/route.ts index/src/app/api/waitlist/route.test.ts
git commit -m "feat: store beta waitlist submissions in vercel blob"
```

### Task 5: Final Integration, Documentation, and Verification

**Files:**
- Modify: `index/README.md`
- Modify: `index/src/components/waitlist/waitlist-form.tsx`
- Modify: `index/src/app/layout.tsx`

- [ ] **Step 1: Write the failing documentation/metadata checks**

```ts
// append to index/src/app/page.test.tsx
it("links the primary CTA to the waitlist section", () => {
  render(<HomePage />);

  const cta = screen.getByRole("link", { name: /join beta/i });
  expect(cta).toHaveAttribute("href", "#waitlist");
});
```

- [ ] **Step 2: Run test to verify it fails if the CTA or metadata drifted**

Run: `cd index && npm run test -- src/app/page.test.tsx`
Expected: FAIL if the final CTA/section wiring is incomplete.

- [ ] **Step 3: Finish the integration and update docs**

```md
<!-- index/README.md -->
# Zrow Site

## Development

```bash
npm install
npm run dev
```

## Environment

Create `.env.local` from `.env.example` and set:

- `BLOB_READ_WRITE_TOKEN`

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

Deploy the `index/` app to Vercel and add `BLOB_READ_WRITE_TOKEN` in the project environment settings.
```

```tsx
// index/src/components/waitlist/waitlist-form.tsx (error copy refinement)
{status === "error" ? (
  <p className="text-sm text-red-300" role="alert">
    {message}
  </p>
) : null}
```

```tsx
// index/src/app/layout.tsx (final metadata refinement)
export const metadata: Metadata = {
  title: "Zrow Beta Waitlist",
  description:
    "Join the early-access waitlist for Zrow, a local-first AI coding environment with agent delegation and explicit control.",
};
```

- [ ] **Step 4: Run full verification**

Run:
- `cd index && npm run lint`
- `cd index && npm run typecheck`
- `cd index && npm run test`
- `cd index && npm run build`

Expected:
- ESLint exits `0`
- TypeScript exits `0`
- Vitest exits `0`
- Next build completes successfully

- [ ] **Step 5: Commit**

```bash
git add index/README.md index/src/app/layout.tsx index/src/components/waitlist/waitlist-form.tsx index/src/app/page.test.tsx
git commit -m "docs: finalize beta waitlist site setup"
```

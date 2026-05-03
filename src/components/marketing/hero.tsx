import { heroContent } from "@/lib/marketing/content";

const heroSignals = [
  { label: "Runs", value: "bounded" },
  { label: "Tools", value: "local" },
  { label: "Risk", value: "approved" },
] as const;

const previewRows = [
  { label: "Diagnose checkout flake", status: "running", tone: "bg-cyan-300" },
  { label: "Patch settings copy", status: "review", tone: "bg-amber-300" },
  { label: "Summarize build logs", status: "done", tone: "bg-emerald-300" },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pb-20 pt-3 md:pb-24">
      <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.035] px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur md:px-5">
        <a href="#main-content" className="group inline-flex items-center gap-3" aria-label="Zrow home">
          <span className="relative flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-inner shadow-white/5">
            <span className="size-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_22px_rgba(157,220,255,0.8)]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Zrow</span>
        </a>

        <div className="hidden items-center gap-2 text-xs text-white/45 sm:flex">
          <span className="rounded-full border border-white/10 px-3 py-1.5 font-mono uppercase tracking-[0.18em] text-white/60">
            Private beta
          </span>
          <span>Manual invites</span>
        </div>
      </header>

      <div className="grid gap-10 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:items-end">
        <div className="max-w-3xl space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            <span className="size-1.5 rounded-full bg-[var(--accent-strong)]" />
            Local-first agent control
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-balance text-white sm:text-6xl md:text-7xl">
            {heroContent.title}
          </h1>

          <p className="max-w-2xl text-base leading-8 text-white/70 md:text-lg md:leading-9">
            {heroContent.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#waitlist"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(255,255,255,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {heroContent.primaryCta}
            </a>

            <p className="text-sm leading-6 text-white/50">
              Manual review only. No self-serve access.
            </p>
          </div>

          <dl className="grid max-w-2xl grid-cols-3 gap-2 pt-3">
            {heroSignals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-inner shadow-white/[0.025]"
              >
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
                  {signal.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white/80">{signal.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:pb-8" aria-hidden="true">
          <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_30%,rgba(157,220,255,0.16),transparent_58%)] blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[#090c11]/75 p-3 shadow-[0_32px_120px_rgba(0,0,0,0.52)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff6b63]" />
                  <span className="size-2.5 rounded-full bg-[#f5bf4f]" />
                  <span className="size-2.5 rounded-full bg-[#62d483]" />
                </div>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                  Workspace
                </span>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white">Delegation run</p>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-100/80">
                      live
                    </span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {previewRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5"
                      >
                        <span className="flex min-w-0 items-center gap-2 text-sm text-white/75">
                          <span className={`size-1.5 shrink-0 rounded-full ${row.tone}`} />
                          <span className="truncate">{row.label}</span>
                        </span>
                        <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-white/35">
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/35">
                      Tool policy
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Sandboxed first. Escalate only when you say so.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.055] p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-100/50">
                      Approval
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      Diff review before risky writes or external calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

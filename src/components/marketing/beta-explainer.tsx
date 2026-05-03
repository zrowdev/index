import { betaExplainerContent } from "@/lib/marketing/content";

export function BetaExplainer() {
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.26)] md:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--accent-strong)]/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] md:items-center">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
              Beta access
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance text-white md:text-4xl">
              {betaExplainerContent.title}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/65 md:text-base md:leading-8">
              {betaExplainerContent.body}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">Invite policy</p>
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/40">
                curated
              </span>
            </div>

            <ul className="space-y-3 text-sm text-white/65">
              {betaExplainerContent.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                    ✓
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

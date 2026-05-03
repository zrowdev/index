import { waitlistContent } from "@/lib/marketing/content";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

const reviewSignals = [
  "Specific coding workflows",
  "Clear automation boundaries",
  "Willingness to give sharp feedback",
] as const;

export function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-8 py-20 md:py-24">
      <div className="rounded-[2rem] border border-white/10 bg-[#0b0e13]/80 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.34)] backdrop-blur md:p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.86fr)_minmax(360px,1fr)] md:items-start">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:sticky md:top-8 md:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
              Request access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance text-white md:text-4xl">
              {waitlistContent.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65 md:text-base md:leading-8">
              {waitlistContent.body}
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-medium text-white">What helps us evaluate fit</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
                {reviewSignals.map((signal) => (
                  <li key={signal} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-xs leading-6 text-white/40">
              Applications are reviewed manually. We only follow up if there is a fit.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

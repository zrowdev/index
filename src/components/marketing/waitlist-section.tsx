import { waitlistContent } from "@/lib/marketing/content";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-6 py-16">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-medium tracking-tight text-balance text-white">
            {waitlistContent.title}
          </h2>
          <p className="text-sm leading-7 text-white/70">{waitlistContent.body}</p>
          <p className="text-xs leading-6 text-white/40">
            Applications are reviewed manually. We only follow up if there is a fit.
          </p>
        </div>

        <WaitlistForm />
      </div>
    </section>
  );
}

import { waitlistContent } from "@/lib/marketing/content";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-6 py-16">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:items-start">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-medium tracking-tight text-balance text-white">
            {waitlistContent.title}
          </h2>
          <p className="text-sm leading-7 text-white/70">
            {waitlistContent.body}
          </p>
        </div>

        <div className="border border-white/10 p-5">
          <p className="text-sm font-medium text-white">Required fields</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/60">
            {waitlistContent.fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-6 text-white/40">
            {waitlistContent.note}
          </p>
        </div>
      </div>
    </section>
  );
}

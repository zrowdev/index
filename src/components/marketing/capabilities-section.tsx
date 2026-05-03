import { capabilitiesContent, capabilityItems } from "@/lib/marketing/content";

export function CapabilitiesSection() {
  return (
    <section className="border-b border-white/10 py-20 md:py-24">
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-start">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
            Capabilities
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance text-white md:text-4xl">
            {capabilitiesContent.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
            Built for runs that touch real code, real terminals, and decisions that need
            a human in the loop.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
          {capabilityItems.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
                0{index + 1}
              </span>
              <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

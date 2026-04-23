import { capabilitiesContent, capabilityItems } from "@/lib/marketing/content";

export function CapabilitiesSection() {
  return (
    <section className="border-b border-white/10 py-16">
      <h2 className="max-w-xl text-2xl font-medium tracking-tight text-balance text-white">
        {capabilitiesContent.title}
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {capabilityItems.map((item) => (
          <article key={item.title} className="border border-white/10 p-5">
            <h2 className="mt-4 text-lg font-medium text-white">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

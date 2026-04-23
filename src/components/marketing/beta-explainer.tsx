import { betaExplainerContent } from "@/lib/marketing/content";

export function BetaExplainer() {
  return (
    <section className="border-b border-white/10 py-16">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-medium tracking-tight text-balance text-white">
            {betaExplainerContent.title}
          </h2>
          <p className="text-sm leading-7 text-white/70">
            {betaExplainerContent.body}
          </p>
        </div>

        <ul className="space-y-3 border-l border-white/10 pl-5 text-sm text-white/60">
          {betaExplainerContent.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

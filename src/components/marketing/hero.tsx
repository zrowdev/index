import { heroContent } from "@/lib/marketing/content";

export function Hero() {
  return (
    <section className="border-b border-white/10 pb-16 pt-12 md:pb-20 md:pt-14">
      <div className="mt-6 max-w-3xl space-y-6">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
          {heroContent.title}
        </h1>

        <p className="max-w-2xl text-base leading-8 text-white/70 md:text-lg">
          {heroContent.description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#waitlist"
            className="inline-flex h-11 items-center border border-white px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {heroContent.primaryCta}
          </a>

          <p className="text-sm leading-6 text-white/45">
            Manual review only. No self-serve access.
          </p>
        </div>
      </div>
    </section>
  );
}

import { BetaExplainer } from "@/components/marketing/beta-explainer";
import { CapabilitiesSection } from "@/components/marketing/capabilities-section";
import { Hero } from "@/components/marketing/hero";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WaitlistSection } from "@/components/marketing/waitlist-section";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-6 md:px-10 md:py-8"
    >
      <Hero />
      <CapabilitiesSection />
      <BetaExplainer />
      <WaitlistSection />
      <SiteFooter />
    </main>
  );
}

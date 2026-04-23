import { BetaExplainer } from "@/components/marketing/beta-explainer";
import { CapabilitiesSection } from "@/components/marketing/capabilities-section";
import { Hero } from "@/components/marketing/hero";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WaitlistSection } from "@/components/marketing/waitlist-section";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 md:py-12"
    >
      <Hero />
      <CapabilitiesSection />
      <BetaExplainer />
      <WaitlistSection />
      <SiteFooter />
    </main>
  );
}

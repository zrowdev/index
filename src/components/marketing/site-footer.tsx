import { siteFooterContent } from "@/lib/marketing/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 text-sm text-white/45">
      <p>
        {siteFooterContent.label} · {siteFooterContent.caption}
      </p>
    </footer>
  );
}

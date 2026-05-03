import { siteFooterContent } from "@/lib/marketing/content";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-medium text-white/60">{siteFooterContent.label}</p>
      <p className="font-mono text-xs uppercase tracking-[0.18em]">
        {siteFooterContent.caption} · local-first delegation
      </p>
    </footer>
  );
}

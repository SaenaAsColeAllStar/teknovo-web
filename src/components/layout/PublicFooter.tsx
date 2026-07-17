import type { ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";

import { BRAND_MAPS_URL, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import {
  getPublicSiteFooterNavBlocks,
  type PublicSiteFooterLink,
} from "@/lib/public-site-footer";

const footerHeadingClass = "text-sm font-semibold text-slate-900 dark:text-white";

const footerLinkClass =
  "text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400";

const footerContactLinkClass =
  "font-medium text-blue-600 transition-colors hover:underline dark:text-blue-400";

function isInternalPublicHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function FooterNavLink({ link }: { link: PublicSiteFooterLink }): ReactElement {
  const className = footerLinkClass;
  const externalLabel = link.external ? (
    <span className="sr-only"> (buka di tab baru)</span>
  ) : null;

  if (isInternalPublicHref(link.href)) {
    return (
      <PublicSiteLink href={link.href} className={className}>
        {link.label}
        {externalLabel}
      </PublicSiteLink>
    );
  }

  if (link.external || link.href.startsWith("http://") || link.href.startsWith("https://")) {
    return (
      <a
        href={link.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
        {externalLabel}
      </a>
    );
  }

  return (
    <a href={link.href} className={className}>
      {link.label}
      {externalLabel}
    </a>
  );
}

export function PublicFooter(): ReactElement {
  const navBlocks = getPublicSiteFooterNavBlocks();

  return (
    <footer id="kontak" className="scroll-mt-20 border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
      <div className="public-site-container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="sm:col-span-2 xl:col-span-2">
            <p className="text-lg font-bold text-slate-900 dark:text-white">SMK {BRAND_SHORT}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              SMK yang mengedepankan karakter, prestasi, dan penguasaan teknologi.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{BRAND_SCHOOL_FULL}</p>
          </div>

          {navBlocks.map((section) => (
            <nav key={section.title} aria-labelledby={`footer-${section.title}`}>
              <h2 id={`footer-${section.title}`} className={footerHeadingClass}>
                {section.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}-${link.label}`}>
                    <FooterNavLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-labelledby="footer-kontak">
            <h2 id="footer-kontak" className={footerHeadingClass}>
              Kontak
            </h2>
            <address className="mt-3 space-y-2 not-italic text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <p>
                <PublicSiteLink href="/kontak" className={footerContactLinkClass}>
                  Halaman kontak
                </PublicSiteLink>
              </p>
              <p>
                Telepon:{" "}
                <a href="tel:+622123456789" className={footerContactLinkClass}>
                  (022) 1234-5678
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:info@smateknovo.sch.id" className={footerContactLinkClass}>
                  info@smateknovo.sch.id
                </a>
              </p>
              <p>
                <a
                  href={BRAND_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerContactLinkClass}
                >
                  Buka di Google Maps
                  <span className="sr-only"> (buka di tab baru)</span>
                </a>
              </p>
            </address>
          </nav>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
          © 2026 SMK {BRAND_SHORT}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}

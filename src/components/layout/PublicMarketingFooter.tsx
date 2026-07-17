import { MapPin } from "lucide-react";
import type { ReactElement, SVGProps } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import {
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
  BRAND_SOCIAL_LINKS,
} from "@/lib/branding";
import {
  PUBLIC_SITE_FOOTER_SECTIONS,
  type PublicSiteNavLeaf,
} from "@/lib/public-site-nav";

const footerHeadingClass = "text-sm font-semibold text-heading";

const footerLinkClass =
  "text-sm text-body transition-colors hover:text-brand";

const socialIconClass =
  "inline-flex size-9 items-center justify-center border border-border-default bg-surface text-body transition-colors hover:border-brand hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

function isInternalPublicHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function FooterNavLink({ link }: { link: PublicSiteNavLeaf }): ReactElement {
  if (isInternalPublicHref(link.href)) {
    return (
      <PublicSiteLink href={link.href} className={footerLinkClass}>
        {link.label}
      </PublicSiteLink>
    );
  }

  if (link.href.startsWith("http://") || link.href.startsWith("https://")) {
    return (
      <a
        href={link.href}
        className={footerLinkClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
        <span className="sr-only"> (buka di tab baru)</span>
      </a>
    );
  }

  return (
    <a href={link.href} className={footerLinkClass}>
      {link.label}
    </a>
  );
}

type GlyphProps = SVGProps<SVGSVGElement>;

function IconInstagram({ className, ...props }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="0" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconYouTube({ className, ...props }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="0" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="currentColor" />
    </svg>
  );
}

function IconFacebook({ className, ...props }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M14 8h2.5V5H14c-2.2 0-4 1.8-4 4v2H7.5v3H10v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIAL_ICONS = {
  instagram: IconInstagram,
  youtube: IconYouTube,
  facebook: IconFacebook,
  maps: MapPin,
} as const;

/**
 * Footer pemasaran situs publik — band merek + empat kolom sitemap + baris hak cipta.
 * Dipakai lewat `PublicFooter` di `PublicSiteLayout`.
 */
export function PublicMarketingFooter(): ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer
      id="kontak"
      className="scroll-mt-20 border-t border-border-default bg-surface"
    >
      <div className="public-site-container flex flex-col gap-16 py-14 sm:gap-20 sm:py-16 lg:py-20">
        {/* Main band */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 xl:gap-20">
          {/* Left — brand + description + social */}
          <div className="flex max-w-md shrink-0 flex-col items-start lg:max-w-sm xl:max-w-md">
            <BrandLogo layout="compact" href="/" shine={false} />
            <p className="mt-5 text-sm leading-relaxed text-body">
              {BRAND_SCHOOL_FULL} di Pamanukan, Subang. Sekolah kejuruan yang
              mengedepankan karakter, kompetensi praktik, dan layanan digital
              untuk siswa serta orang tua.
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-2.5" aria-label="Media sosial">
              {BRAND_SOCIAL_LINKS.map((item) => {
                const Icon = SOCIAL_ICONS[item.id];
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={socialIconClass}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      <Icon className="size-4 shrink-0" strokeWidth={item.id === "maps" ? 1.75 : undefined} />
                      <span className="sr-only">
                        {item.label} (buka di tab baru)
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right — four sitemap columns */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 xl:gap-x-8">
            {PUBLIC_SITE_FOOTER_SECTIONS.map((section) => (
              <nav
                key={section.title}
                aria-labelledby={`footer-${section.title}`}
                className="min-w-0"
              >
                <h2
                  id={`footer-${section.title}`}
                  className={footerHeadingClass}
                >
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.href}-${link.label}`}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Copyright row */}
        <div className="border-t border-border-default pt-8 text-center text-sm text-body-subtle">
          © {year} SMK {BRAND_SHORT}. {BRAND_SCHOOL_FULL}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}

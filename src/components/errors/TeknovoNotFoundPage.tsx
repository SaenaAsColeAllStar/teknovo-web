import { Home, Mail, Newspaper, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

import { BrandLogoMark } from "@/components/brand/BrandLogoMark";
import { NotFoundLostIllustration } from "@/components/errors/NotFoundLostIllustration";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { BRAND_SHORT } from "@/lib/branding";
import {
  getTeknovoNotFoundHomeHref,
  type TeknovoNotFoundApp,
} from "@/lib/teknovo-not-found";
import { cn } from "@/lib/utils";

type TeknovoNotFoundPageProps = {
  app: TeknovoNotFoundApp;
  /** Override tautan beranda (default: per-app via `getTeknovoNotFoundHomeHref`). */
  homeHref?: string;
  /**
   * Saat 404 dipicu dari rute `(site)` landing, halaman masih dibungkus `PublicSiteLayout`.
   * `fixed` menutup navbar/footer agar satu layar penuh.
   */
  escapePublicChrome?: boolean;
  className?: string;
};

type ShortcutLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Halaman 404 bermerek SMK Teknovo — layout dua kolom (konten + ilustrasi SVG).
 */
export function TeknovoNotFoundPage({
  app,
  homeHref,
  escapePublicChrome = false,
  className,
}: TeknovoNotFoundPageProps): ReactElement {
  const home = homeHref ?? getTeknovoNotFoundHomeHref(app);

  const shortcuts: readonly ShortcutLink[] = [
    { href: home, label: "Beranda", icon: Home },
    { href: "/berita", label: "Berita", icon: Newspaper },
    { href: "/kontak", label: "Kontak", icon: Mail },
  ];

  return (
    <main
      className={cn(
        "relative isolate flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-surface",
        escapePublicChrome && "fixed inset-0 z-[200] overflow-y-auto",
        className,
      )}
    >
      {/* Soft Atlas atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(19,19,186,0.06),transparent_55%),radial-gradient(ellipse_at_85%_70%,rgba(232,232,248,0.9),transparent_50%)]"
      />

      <div className="public-site-container relative flex flex-1 flex-col justify-center py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Left — reading order first */}
          <div className="flex flex-col items-start text-left">
            <PublicSiteLink
              href={home}
              className="mb-8 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              aria-label={`Beranda ${BRAND_SHORT}`}
            >
              <BrandLogoMark
                pixelSize={36}
                shine={false}
                priority
                roundedClassName="rounded-none"
              />
              <span className="text-sm font-bold tracking-[0.06em] text-brand">
                SMK {BRAND_SHORT}
              </span>
            </PublicSiteLink>

            <h1 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl xl:text-5xl xl:leading-[1.12]">
              404 / Halaman tidak ditemukan
            </h1>
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-body sm:text-base">
              Maaf, alamat yang Anda buka tidak tersedia atau telah dipindahkan.
              Muat ulang halaman, atau kembali lewat tautan di bawah.
            </p>

            <nav
              aria-label="Tautan cepat"
              className="mt-10 flex w-full max-w-md flex-row items-stretch gap-3 sm:mt-12 sm:gap-4"
            >
              {shortcuts.map(({ href, label, icon: Icon }) => (
                <PublicSiteLink
                  key={label}
                  href={href}
                  className={cn(
                    "group flex min-w-0 flex-1 flex-col items-center justify-center gap-2 border border-border-default bg-surface px-2 py-4",
                    "transition-colors hover:border-brand/40 hover:bg-border-default/60",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
                  )}
                >
                  <span
                    className="flex size-9 items-center justify-center text-brand transition-transform group-hover:scale-105"
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-center text-xs font-semibold tracking-wide text-heading sm:text-sm">
                    {label}
                  </span>
                </PublicSiteLink>
              ))}
            </nav>
          </div>

          {/* Right — illustration; stacks below on narrow */}
          <div className="flex items-center justify-center lg:justify-end">
            <NotFoundLostIllustration className="h-auto w-full max-w-[28rem] lg:max-w-[32rem]" />
          </div>
        </div>
      </div>
    </main>
  );
}

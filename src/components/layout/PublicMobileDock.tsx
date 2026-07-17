"use client";

import { LayoutGroup, m, useReducedMotion } from "framer-motion";
import type { ReactElement } from "react";

import {
  GlyphDockAkademik,
  GlyphDockBeranda,
  GlyphDockFasilitas,
  GlyphDockKesiswaan,
  GlyphDockPpdb,
  GlyphDockPrestasi,
  type PublicNavGlyphProps,
} from "@/components/icons/public-nav-glyphs";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { WhiteLightSweep } from "@/components/motion/WhiteLightSweep";
import { usePublicSitePathname } from "@/hooks/use-public-site-pathname";
import {
  PUBLIC_SITE_MOBILE_DOCK_PPDB,
  PUBLIC_SITE_MOBILE_DOCK_TABS,
  type PublicMobileDockTab,
  type PublicMobileDockTabId,
} from "@/lib/public-mobile-dock";
import { cn } from "@/lib/utils";

const DOCK_GLYPHS: Record<PublicMobileDockTabId, (props: PublicNavGlyphProps) => ReactElement> = {
  beranda: GlyphDockBeranda,
  fasilitas: GlyphDockFasilitas,
  akademik: GlyphDockAkademik,
  prestasi: GlyphDockPrestasi,
  kesiswaan: GlyphDockKesiswaan,
};

const dockEnterTransition = { type: "spring", stiffness: 320, damping: 34, mass: 0.8 } as const;
const pillEnterTransition = { type: "spring", stiffness: 280, damping: 26, mass: 0.75 } as const;

function DockWave(): ReactElement {
  return (
    <svg
      viewBox="0 0 390 36"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -top-[1.65rem] h-9 w-full text-white text-surface"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 36V18c58-14 116-14 174 0s116 14 174 0 58-14 42-14V36H0Z"
      />
    </svg>
  );
}

function DockTab({
  tab,
  active,
  reduceMotion,
}: {
  tab: PublicMobileDockTab;
  active: boolean;
  reduceMotion: boolean;
}): ReactElement {
  const Glyph = DOCK_GLYPHS[tab.id];

  return (
    <m.li
      className="relative flex min-w-0 flex-1 justify-center"
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.12 }}
    >
      <PublicSiteLink
        href={tab.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex w-full max-w-[4.5rem] flex-col items-center gap-1 px-1 pb-1.5 pt-2 text-[0.65rem] font-medium leading-none",
          active ? "text-blue-700 dark:text-blue-200" : "text-slate-500 dark:text-slate-400",
        )}
      >
        <span className="relative flex size-10 items-center justify-center">
          {active ? (
            <m.span
              layoutId="public-mobile-dock-active"
              className="absolute inset-0 rounded-2xl bg-brand shadow-md shadow-brand/25"
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            />
          ) : null}
          <Glyph className={cn("relative z-10 size-5", active && "text-white")} />
        </span>
        <span className="relative z-10 truncate">{tab.label}</span>
      </PublicSiteLink>
    </m.li>
  );
}

function DockPpdbPill({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }): ReactElement {
  return (
    <m.div
      className="pointer-events-none absolute inset-x-0 top-0 z-20"
      initial={reduceMotion ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={pillEnterTransition}
    >
      <PublicSiteLink
        href={PUBLIC_SITE_MOBILE_DOCK_PPDB.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "pointer-events-auto relative isolate flex w-full items-center justify-center gap-2 overflow-hidden rounded-t-[1.75rem] px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_28px_-12px_rgba(37,99,235,0.65)] transition-colors",
          active ? "bg-brand-strong ring-2 ring-brand/40" : "bg-brand hover:bg-brand-strong",
        )}
      >
        <WhiteLightSweep roundedClassName="rounded-t-[1.75rem]" />
        <GlyphDockPpdb className="relative z-10 size-4 text-white" />
        <span className="relative z-10">{PUBLIC_SITE_MOBILE_DOCK_PPDB.label}</span>
      </PublicSiteLink>
    </m.div>
  );
}

export function PublicMobileDock(): ReactElement {
  const pathname = usePublicSitePathname();
  const reduceMotion = useReducedMotion();
  const ppdbActive = PUBLIC_SITE_MOBILE_DOCK_PPDB.isActive(pathname);

  return (
    <LayoutGroup id="public-mobile-dock">
      <m.nav
        aria-label="Navigasi utama mobile"
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
        initial={reduceMotion ? false : { y: "100%" }}
        animate={{ y: 0 }}
        transition={dockEnterTransition}
      >
        <div className="relative mx-auto max-w-lg px-2 pb-[max(0.35rem,env(safe-area-inset-bottom,0px))]">
          <div className="relative overflow-hidden rounded-t-[1.75rem] border border-border-default/90 bg-surface pt-8 shadow-[0_-18px_40px_-24px_rgb(19_19_186/0.28)]">
            <DockWave />
            <DockPpdbPill active={ppdbActive} reduceMotion={Boolean(reduceMotion)} />
            <ul className="relative grid grid-cols-5 items-end px-1 pb-1">
              {PUBLIC_SITE_MOBILE_DOCK_TABS.map((tab) => (
                <DockTab key={tab.id} tab={tab} active={tab.isActive(pathname)} reduceMotion={Boolean(reduceMotion)} />
              ))}
            </ul>
          </div>
        </div>
      </m.nav>
    </LayoutGroup>
  );
}

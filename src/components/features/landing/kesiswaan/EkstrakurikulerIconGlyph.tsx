import type { ReactElement } from "react";

import type { GlyphProps } from "@/components/icons/inline-glyphs";
import type { EkstrakurikulerFilterIconKey } from "@/lib/ekstrakurikuler-landing-content";
import { cn } from "@/lib/utils";

export type EkstrakurikulerIconKey =
  | EkstrakurikulerFilterIconKey
  | "osis"
  | "schedule"
  | "location"
  | "coach"
  | "opportunities"
  | "prestasi";

function IcoEkstraSemuaOrbit({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.25" opacity={0.35} />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IcoEkstraTeknologiLattice({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 8h5v5H6zM13 8h5v5h-5zM6 15h5v3H6z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M14 17h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoEkstraOlahragaArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 18c2-6 5-9 7-9s5 3 7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IcoEkstraAkademikPillar({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 19V9l7-4 7 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoEkstraSeniWave({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M5 14c2-3 4-4 7-4s5 1 7 4M5 10c2-2 4-3 7-3s5 1 7 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="17" r="1" fill="currentColor" opacity={0.5} />
    </svg>
  );
}

function IcoEkstraOsisOrbit({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 20c1.2-3 3.5-4.5 6-4.5s4.8 1.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IcoEkstraSchedule({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <rect x="5" y="6" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v3M16 4v3M5 10h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoEkstraLocation({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IcoEkstraCoach({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M8 18v-4a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IcoEkstraOpportunities({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 16h16M8 12l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoEkstraPrestasiLaurel({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 9c-2 1-3 3-3 5M16 9c2 1 3 3 3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

const GLYPHS: Record<EkstrakurikulerIconKey, (props: GlyphProps) => ReactElement> = {
  semua: IcoEkstraSemuaOrbit,
  teknologi: IcoEkstraTeknologiLattice,
  olahraga: IcoEkstraOlahragaArc,
  akademik: IcoEkstraAkademikPillar,
  seni: IcoEkstraSeniWave,
  osis: IcoEkstraOsisOrbit,
  schedule: IcoEkstraSchedule,
  location: IcoEkstraLocation,
  coach: IcoEkstraCoach,
  opportunities: IcoEkstraOpportunities,
  prestasi: IcoEkstraPrestasiLaurel,
};

export function EkstrakurikulerIconGlyph({
  iconKey,
  className,
}: {
  iconKey: EkstrakurikulerIconKey;
  className?: string;
}): ReactElement {
  const Ico = GLYPHS[iconKey];
  return <Ico className={className} />;
}

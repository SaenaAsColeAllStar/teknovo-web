import type { ReactElement } from "react";

import type { GlyphProps } from "@/components/icons/inline-glyphs";
import { cn } from "@/lib/utils";

export type KesiswaanIconKey =
  | "program"
  | "osis"
  | "prestasi"
  | "trophy"
  | "document"
  | "close"
  | "portal"
  | "calendar";

function IcoKesiswaanProgramArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 18V8l7-4 7 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14h6M9 11h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1" fill="currentColor" opacity={0.6} />
    </svg>
  );
}

function IcoKesiswaanOsisOrbit({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 20c1.2-3 3.5-4.5 6-4.5s4.8 1.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoKesiswaanPrestasiLaurel({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M12 6v12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 9c-2 1-3 3-3 5M16 9c2 1 3 3 3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IcoKesiswaanTrophySpire({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M8 6h8v5a4 4 0 01-8 0V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 8H5a2 2 0 002 2M18 8h1a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10 18h4v2H10v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoKesiswaanDocumentFold({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M7 5h7l4 4v12H7V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 5v4h4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoKesiswaanCloseLattice({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" opacity={0.25} />
    </svg>
  );
}

function IcoKesiswaanPortalGate({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 19V9l7-4 7 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 19v-6h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 5v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoKesiswaanCalendarArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <rect x="5" y="6" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v3M16 4v3M5 10h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" opacity={0.5} />
    </svg>
  );
}

const GLYPHS: Record<KesiswaanIconKey, (props: GlyphProps) => ReactElement> = {
  program: IcoKesiswaanProgramArc,
  osis: IcoKesiswaanOsisOrbit,
  prestasi: IcoKesiswaanPrestasiLaurel,
  trophy: IcoKesiswaanTrophySpire,
  document: IcoKesiswaanDocumentFold,
  close: IcoKesiswaanCloseLattice,
  portal: IcoKesiswaanPortalGate,
  calendar: IcoKesiswaanCalendarArc,
};

export function KesiswaanIconGlyph({
  iconKey,
  className,
}: {
  iconKey: KesiswaanIconKey;
  className?: string;
}): ReactElement {
  const Ico = GLYPHS[iconKey];
  return <Ico className={className} />;
}

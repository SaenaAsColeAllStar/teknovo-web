import type { ReactElement } from "react";

import type { FasilitasSlug } from "@/lib/fasilitas-landing-content";
import { cn } from "@/lib/utils";

type GlyphProps = {
  className?: string;
};

export type FasilitasAbsensiAudienceIconKey =
  | "audience-siswa"
  | "audience-guru"
  | "audience-ortu"
  | "audience-kesiswaan";

export type FasilitasIconKey = FasilitasSlug | "hub" | "hours" | "service" | FasilitasAbsensiAudienceIconKey;

function IcoHubOrbit({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.35} />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
    </svg>
  );
}

function IcoAbsensiPulse({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M4 14h4l2-4 3 8 2-4h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

function IcoLabLattice({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M5 8h6v8H5zM13 6h6v10h-6z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M8 11h2M15 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoLibraryArc({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M6 18V8c0-2 2.5-4 6-4s6 2 6 4v10" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M9 14h6M9 11h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IcoLmsFlow({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
      <path d="M16 16l3 2-3 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoHoursSun({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
    </svg>
  );
}

function IcoServiceWeave({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M8 10a4 4 0 108 0 4 4 0 10-8 0" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 19c1.5-2 4-3 6-3s4.5 1 6 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoAudienceSiswa({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M12 5a3 3 0 100 6 3 3 0 000-6z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 19c.8-3 2.7-4.5 5-4.5s4.2 1.5 5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoAudienceGuru({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <rect x="5" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
      <path d="M12 5v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IcoAudienceOrtu({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M6 11a2.5 2.5 0 114 0 2.5 2.5 0 01-4 0zM14 11a2.5 2.5 0 114 0 2.5 2.5 0 01-4 0z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4 18c1-2 2.8-3 4-3M14 18c1-2 2.8-3 4-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity={0.55} />
      <path d="M10 14h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IcoAudienceKesiswaan({ className }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path d="M12 4l6 4v8l-6 4-6-4V8l6-4z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

const GLYPH_BY_KEY: Record<FasilitasIconKey, (props: GlyphProps) => ReactElement> = {
  hub: IcoHubOrbit,
  "absensi-digital": IcoAbsensiPulse,
  "laboratorium-komputer": IcoLabLattice,
  "perpustakaan-digital": IcoLibraryArc,
  "lms-sekolah": IcoLmsFlow,
  hours: IcoHoursSun,
  service: IcoServiceWeave,
  "audience-siswa": IcoAudienceSiswa,
  "audience-guru": IcoAudienceGuru,
  "audience-ortu": IcoAudienceOrtu,
  "audience-kesiswaan": IcoAudienceKesiswaan,
};

export function FasilitasIconGlyph({
  iconKey,
  className,
}: {
  iconKey: FasilitasIconKey;
  className?: string;
}): ReactElement {
  const Glyph = GLYPH_BY_KEY[iconKey];
  return <Glyph className={className} />;
}

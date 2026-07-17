import type { ReactElement } from "react";

import type { GlyphProps } from "@/components/icons/inline-glyphs";
import { cn } from "@/lib/utils";

export type AkademikIconKey = "kurikulum" | "jurusan" | "pengajar" | "digital" | "pathway";

function IcoAkademikKurikulumArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 18V9l8-5 8 5v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 14h8M8 11h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M12 4v2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoAkademikJurusanCompass({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.35} />
      <path d="M12 8l2 4-4 1 2-5z" fill="currentColor" opacity={0.85} />
    </svg>
  );
}

function IcoAkademikPengajarLattice({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 20v-4a3 3 0 016 0v4M15 20v-3a2.5 2.5 0 015 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IcoAkademikDigitalWave({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <rect x="5" y="6" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M6 19c1.5-2 3-2 6 0s4.5 2 6 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}

function IcoAkademikPathwaySteps({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 18V6l7-3 7 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14h6M9 10h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
    </svg>
  );
}

const GLYPHS: Record<AkademikIconKey, (props: GlyphProps) => ReactElement> = {
  kurikulum: IcoAkademikKurikulumArc,
  jurusan: IcoAkademikJurusanCompass,
  pengajar: IcoAkademikPengajarLattice,
  digital: IcoAkademikDigitalWave,
  pathway: IcoAkademikPathwaySteps,
};

export function AkademikIconGlyph({
  iconKey,
  className,
}: {
  iconKey: AkademikIconKey;
  className?: string;
}): ReactElement {
  const Ico = GLYPHS[iconKey];
  return <Ico className={className} />;
}

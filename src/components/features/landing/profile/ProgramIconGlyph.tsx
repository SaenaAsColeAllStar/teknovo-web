import type { ReactElement } from "react";

import type { GlyphProps } from "@/components/icons/inline-glyphs";
import type {
  ProgramDigitalIconKey,
  ProgramPembinaanIconKey,
} from "@/lib/program-sekolah-content";
import { cn } from "@/lib/utils";

function IcoProgramKurikulumArc({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M5 18V8l7-4 7 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 14h6M9 11h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

function IcoProgramPklBridge({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16V10l4-3 4 3v6M14 16V9l4-3v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IcoProgramSertifikasiSeal({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 19l4 2 4-2" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function IcoProgramLiterasiWave({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path
        d="M5 14c2-3 4-3 7 0s5 3 7 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 8h8M10 5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity={0.5} />
      <circle cx="17" cy="7" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IcoProgramPortalOrbit({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

function IcoProgramElearningLattice({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <rect x="5" y="6" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

function IcoProgramPpdbGate({ className, ...p }: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)} aria-hidden {...p}>
      <path d="M6 20V8l6-4 6 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 8v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

const pembinaanGlyphByKey: Record<
  ProgramPembinaanIconKey,
  (props: GlyphProps) => ReactElement
> = {
  kurikulum: IcoProgramKurikulumArc,
  pkl: IcoProgramPklBridge,
  sertifikasi: IcoProgramSertifikasiSeal,
  "literasi-digital": IcoProgramLiterasiWave,
};

const digitalGlyphByKey: Record<ProgramDigitalIconKey, (props: GlyphProps) => ReactElement> = {
  portal: IcoProgramPortalOrbit,
  elearning: IcoProgramElearningLattice,
  ppdb: IcoProgramPpdbGate,
};

type ProgramIconGlyphProps = GlyphProps & {
  iconKey: ProgramPembinaanIconKey | ProgramDigitalIconKey;
};

export function ProgramIconGlyph({ iconKey, className, ...props }: ProgramIconGlyphProps): ReactElement {
  const Glyph =
    iconKey in pembinaanGlyphByKey
      ? pembinaanGlyphByKey[iconKey as ProgramPembinaanIconKey]
      : digitalGlyphByKey[iconKey as ProgramDigitalIconKey];

  return <Glyph className={className} {...props} />;
}

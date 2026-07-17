import type { ReactElement } from "react";

import { PpdbCtaLink } from "@/components/brand/PpdbCtaLink";
import { PublicFinalCta } from "@/components/features/landing/PublicFinalCta";
import { MotionInView } from "@/components/motion/MotionInView";
import { PUBLIC_SITE_PPDB_DAFTAR_HREF } from "@/lib/public-site-nav";

export function FinalCtaSection(): ReactElement {
  return (
    <section className="bg-white py-14 dark:bg-slate-950 sm:py-16">
      <MotionInView as="div" className="mx-auto public-site-container" delay={0.08}>
        <PublicFinalCta
          id="cta-final"
          eyebrow="Siap Menjadi Bagian dari Inovasi?"
          title="Bergabunglah dengan SMK TEKNOVO Sekarang!"
          description="Mulai proses pendaftaran PPDB dan temukan masa depan digital yang lebih terarah."
          delay={0}
          as="div"
        >
          <PpdbCtaLink href={PUBLIC_SITE_PPDB_DAFTAR_HREF} label="Daftar PPDB Sekarang" />
        </PublicFinalCta>
      </MotionInView>
    </section>
  );
}

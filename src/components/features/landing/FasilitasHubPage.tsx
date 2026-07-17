import type { ReactElement } from "react";

import { FasilitasPageShell } from "@/components/features/landing/FasilitasPageShell";
import { FasilitasIconGlyph } from "@/components/features/landing/FasilitasIconGlyph";
import { PublicFeatureGridCard } from "@/components/features/landing/PublicFeatureGridCard";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  FASILITAS_ITEMS,
  FASILITAS_PAGE_LEDE,
  FASILITAS_PAGE_TITLE,
  getFasilitasDetailPath,
} from "@/lib/fasilitas-landing-content";

export function FasilitasHubPage(): ReactElement {
  return (
    <FasilitasPageShell title={FASILITAS_PAGE_TITLE} lede={FASILITAS_PAGE_LEDE} showHubHero>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
        {FASILITAS_ITEMS.map((item, idx) => (
          <MotionInView as="li" key={item.slug}>
            <PublicFeatureGridCard
              title={item.title}
              description={item.description}
              coverSrc={item.coverSrc}
              coverAlt={item.title}
              href={getFasilitasDetailPath(item.slug)}
              icon={<FasilitasIconGlyph iconKey={item.slug} className="size-5" />}
              tags={item.highlights.slice(0, 3).map((label) => ({ label }))}
              priority={idx === 0}
            />
          </MotionInView>
        ))}
      </ul>
    </FasilitasPageShell>
  );
}

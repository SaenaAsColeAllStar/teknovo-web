import type { ReactElement } from "react";

import { FourBandPageSlice } from "@/components/features/landing/FourBandPageSlice";
import { KesiswaanIconGlyph } from "@/components/features/landing/kesiswaan/KesiswaanIconGlyph";
import {
  KESISWAAN_HUB_HERO_IMAGE_SRC,
  KESISWAAN_SLICE_FEATURES,
  KESISWAAN_SLICE_HEADLINE,
  KESISWAAN_SLICE_SHOWCASE_ALT,
  KESISWAAN_SLICE_SUPPORT,
} from "@/lib/kesiswaan-landing-content";

/**
 * Hub `#kesiswaan` page slice — intro split, showcase photo,
 * and two feature columns (ekskul + prestasi).
 */
export function KesiswaanHubBands(): ReactElement {
  return (
    <FourBandPageSlice
      headline={KESISWAAN_SLICE_HEADLINE}
      support={KESISWAAN_SLICE_SUPPORT}
      image={{
        src: KESISWAAN_HUB_HERO_IMAGE_SRC,
        alt: KESISWAAN_SLICE_SHOWCASE_ALT,
        priority: true,
      }}
      features={[
        {
          icon: <KesiswaanIconGlyph iconKey={KESISWAAN_SLICE_FEATURES[0].iconKey} className="size-5" />,
          title: KESISWAAN_SLICE_FEATURES[0].title,
          body: KESISWAAN_SLICE_FEATURES[0].body,
        },
        {
          icon: <KesiswaanIconGlyph iconKey={KESISWAAN_SLICE_FEATURES[1].iconKey} className="size-5" />,
          title: KESISWAAN_SLICE_FEATURES[1].title,
          body: KESISWAAN_SLICE_FEATURES[1].body,
        },
      ]}
    />
  );
}

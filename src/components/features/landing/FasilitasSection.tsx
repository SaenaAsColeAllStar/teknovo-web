import type { ReactElement } from "react";

import {
  FasilitasFeatureSection,
  type FasilitasFeatureSectionProps,
} from "@/components/features/landing/FasilitasFeatureSection";

export type FasilitasSectionProps = FasilitasFeatureSectionProps;

/** Beranda — section `#fasilitas` (feature cards + segmented nav). */
export function FasilitasSection(props: FasilitasSectionProps = {}): ReactElement {
  return <FasilitasFeatureSection {...props} />;
}

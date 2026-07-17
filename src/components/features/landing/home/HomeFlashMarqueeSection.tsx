import type { ReactElement } from "react";

import { FlashInfoMarquee } from "@/components/features/landing/home/FlashInfoMarquee";
import {
  HOME_FLASH_MARQUEE_ITEMS,
  HOME_FLASH_MARQUEE_LABEL,
} from "@/lib/home-landing-content";
import {
  getCachedForPublic,
  landingMarqueeTexts,
} from "@/services/pengaturan-situs-publik";

export async function HomeFlashMarqueeSection(): Promise<ReactElement> {
  let items: readonly string[] = HOME_FLASH_MARQUEE_ITEMS;
  let label: string = HOME_FLASH_MARQUEE_LABEL;

  try {
    const data = await getCachedForPublic();
    const texts = landingMarqueeTexts(data);
    if (texts.length > 0) {
      items = texts;
      label = data.landingMarqueeLabel;
    }
  } catch {
    /* fallback konstanta statis */
  }

  return <FlashInfoMarquee items={items} label={label} />;
}

import type { ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PublicOptimizedImage,
  publicOptimizedImageContainerClassName,
} from "@/components/shared/PublicOptimizedImage";
import {
  BERITA_BENTO_CTA_BACA,
  BERITA_BENTO_CTA_LIHAT,
  BERITA_HERO_IMAGE_SRC,
  BERITA_KEGIATAN_PAGE_TITLE,
  BERITA_TERBARU_PAGE_TITLE,
} from "@/lib/berita-landing-content";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import { cn } from "@/lib/utils";

import type { BeritaItem } from "./berita-data";

export type BeritaBentoTile = {
  id: string;
  href: string;
  /** Judul; baris baru (`\n`) dirender sebagai multi-line. */
  title: string;
  imageSrc: string;
  ctaLabel: string;
};

const FALLBACK_TILES: readonly BeritaBentoTile[] = [
  {
    id: "bento-arsip",
    href: "/berita/kegiatan-sekolah",
    title: "Arsip berita &\npengumuman resmi",
    imageSrc: LANDING_MEDIA.berita.ppdb2026Webp,
    ctaLabel: BERITA_BENTO_CTA_BACA,
  },
  {
    id: "bento-kegiatan",
    href: "/berita/kegiatan-sekolah",
    title: BERITA_KEGIATAN_PAGE_TITLE,
    imageSrc: LANDING_MEDIA.kegiatan.ekstraOsisWebp,
    ctaLabel: BERITA_BENTO_CTA_LIHAT,
  },
  {
    id: "bento-terbaru",
    href: "/berita/berita-terbaru",
    title: BERITA_TERBARU_PAGE_TITLE,
    imageSrc: BERITA_HERO_IMAGE_SRC,
    ctaLabel: BERITA_BENTO_CTA_BACA,
  },
] as const;

function tileFromItem(item: BeritaItem, index: number): BeritaBentoTile {
  const isKegiatan = item.source === "sekolah";
  return {
    id: item.id,
    href: item.detailHref ?? (isKegiatan ? "/berita/kegiatan-sekolah" : "/berita/berita-terbaru"),
    title: item.judul,
    imageSrc: item.coverSrc || FALLBACK_TILES[index]?.imageSrc || BERITA_HERO_IMAGE_SRC,
    ctaLabel: isKegiatan ? BERITA_BENTO_CTA_LIHAT : BERITA_BENTO_CTA_BACA,
  };
}

/** Bangun 3 ubin bento dari pos terbaru; sisanya diisi fallback destinasi arsip. */
export function buildBeritaBentoTiles(items: BeritaItem[]): BeritaBentoTile[] {
  const fromItems = items.slice(0, 3).map(tileFromItem);
  if (fromItems.length >= 3) return fromItems;
  const usedIds = new Set(fromItems.map((t) => t.id));
  const fillers = FALLBACK_TILES.filter((t) => !usedIds.has(t.id));
  return [...fromItems, ...fillers].slice(0, 3);
}

type BeritaBentoHeroProps = {
  tiles?: BeritaBentoTile[];
};

function BentoTile({
  tile,
  wide,
  asHeading,
}: {
  tile: BeritaBentoTile;
  wide?: boolean;
  asHeading?: "h1" | "h2";
}): ReactElement {
  const Heading = asHeading ?? "h2";

  return (
    <PublicSiteLink
      href={tile.href}
      className={cn(
        "group relative block h-96 w-full overflow-hidden rounded-3xl",
        publicOptimizedImageContainerClassName,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
      )}
    >
      <PublicOptimizedImage
        src={tile.imageSrc}
        alt=""
        fill
        sizes={wide ? "(max-width: 768px) 100vw, 1280px" : "(max-width: 768px) 100vw, 640px"}
        priority={Boolean(wide)}
        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 bg-gradient-to-tr from-[#06064a]/95 via-[#0a0a7a]/80 to-[#1313BA]/55",
          "transition-opacity duration-500 ease-out",
          "opacity-100 group-hover:opacity-70",
        )}
      />
      <span className="relative z-10 flex h-full flex-col justify-start p-6 sm:p-8 lg:p-10">
        <Heading
          className={cn(
            "max-w-3xl whitespace-pre-line text-left font-bold leading-tight tracking-tight text-white",
            wide
              ? "text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              : "text-xl sm:text-2xl",
          )}
        >
          {tile.title}
        </Heading>
        <span
          className={cn(
            "mt-5 inline-flex w-fit items-center rounded-lg bg-[#1313BA] px-4 py-2.5 text-sm font-semibold text-white",
            "transition-colors duration-300 group-hover:bg-[#0f0f9a]",
            "sm:mt-6 sm:px-5 sm:py-3",
          )}
        >
          {tile.ctaLabel}
        </span>
      </span>
    </PublicSiteLink>
  );
}

/**
 * Bento intro arsip berita — 1 ubin lebar + 2 ubin bawah, foto + overlay brand gelap.
 */
export function BeritaBentoHero({ tiles: tilesProp }: BeritaBentoHeroProps): ReactElement {
  const tiles = tilesProp && tilesProp.length >= 3 ? tilesProp.slice(0, 3) : [...FALLBACK_TILES];
  const [top, left, right] = tiles;

  return (
    <MotionInView as="div" className="py-8 sm:py-10 lg:py-14" delay={0.02}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2" role="list" aria-label="Sorotan berita">
        <div className="md:col-span-2" role="listitem">
          <BentoTile tile={top} wide asHeading="h1" />
        </div>
        <div role="listitem">
          <BentoTile tile={left} asHeading="h2" />
        </div>
        <div role="listitem">
          <BentoTile tile={right} asHeading="h2" />
        </div>
      </div>
    </MotionInView>
  );
}

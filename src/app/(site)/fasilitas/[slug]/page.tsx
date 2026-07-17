import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { FasilitasAbsensiDigitalPage } from "@/components/features/landing/FasilitasAbsensiDigitalPage";
import { FasilitasDetailPage } from "@/components/features/landing/FasilitasDetailPage";
import { LmsJsonLd } from "@/components/features/lms/LmsJsonLd";
import {
  FASILITAS_SLUGS,
  type FasilitasSlug,
  getFasilitasItem,
  isFasilitasSlug,
} from "@/lib/fasilitas-landing-content";
import { buildLmsLandingMetadata } from "@/lib/lms-dashboard-seo";
import { getLmsPublikStats } from "@/services/lms-publik-stats";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export function generateStaticParams(): { slug: FasilitasSlug }[] {
  return FASILITAS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "lms-sekolah") {
    return buildLmsLandingMetadata("fasilitas-lms");
  }
  const item = isFasilitasSlug(slug) ? getFasilitasItem(slug) : undefined;
  if (!item) {
    return { title: "Fasilitas" };
  }
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function FasilitasSlugPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await params;
  if (!isFasilitasSlug(slug)) {
    notFound();
  }
  if (slug === "absensi-digital") {
    return <FasilitasAbsensiDigitalPage />;
  }
  const liveStats = slug === "lms-sekolah" ? await getLmsPublikStats() : undefined;
  return (
    <>
      {slug === "lms-sekolah" ? <LmsJsonLd pageId="fasilitas-lms" /> : null}
      <FasilitasDetailPage slug={slug} liveStats={liveStats} />
    </>
  );
}

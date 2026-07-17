import type { ReactElement } from "react";

import {
  buildLmsBreadcrumbJsonLd,
  buildLmsEducationalOrganizationJsonLd,
  buildLmsSoftwareApplicationJsonLd,
  buildLmsWebApplicationJsonLd,
  buildLmsWebPageJsonLd,
  LMS_PAGE_SEO,
  LMS_PUBLIC_PATHS,
  type LmsPageId,
} from "@/lib/lms-dashboard-seo";

type LmsJsonLdProps = {
  pageId: LmsPageId;
};

function JsonLdScript({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** JSON-LD terstruktur untuk halaman LMS (server component). */
export function LmsJsonLd({ pageId }: LmsJsonLdProps): ReactElement {
  const seo = LMS_PAGE_SEO[pageId];
  const origin = seo.origin ?? "landing";

  const webPage = buildLmsWebPageJsonLd({
    name: seo.title,
    description: seo.description,
    path: seo.path,
    origin,
  });

  const org = buildLmsEducationalOrganizationJsonLd();
  const software = buildLmsSoftwareApplicationJsonLd();
  const webApp = buildLmsWebApplicationJsonLd();

  const breadcrumbItems =
    pageId === "fasilitas-lms"
      ? [
          { name: "Beranda", path: "/" },
          { name: "Fasilitas", path: LMS_PUBLIC_PATHS.fasilitasHub },
          { name: "LMS Sekolah", path: LMS_PUBLIC_PATHS.fasilitasLms },
        ]
      : pageId === "fasilitas-hub"
        ? [
            { name: "Beranda", path: "/" },
            { name: "Fasilitas", path: LMS_PUBLIC_PATHS.fasilitasHub },
          ]
        : pageId === "akademik-digital"
          ? [
              { name: "Beranda", path: "/" },
              { name: "Akademik", path: "/akademik" },
              { name: "Program digital", path: LMS_PUBLIC_PATHS.akademikDigital },
            ]
          : pageId === "akademik-kurikulum"
            ? [
                { name: "Beranda", path: "/" },
                { name: "Akademik", path: "/akademik" },
                { name: "Kurikulum", path: LMS_PUBLIC_PATHS.akademikKurikulum },
              ]
            : pageId === "dashboard-login"
              ? [
                  { name: "Beranda", path: "/" },
                  { name: "Portal LMS", path: LMS_PUBLIC_PATHS.portalLogin, origin: "console" as const },
                ]
              : [{ name: "Beranda", path: "/" }, { name: seo.title }];

  const breadcrumb = buildLmsBreadcrumbJsonLd(breadcrumbItems);

  if (pageId === "dashboard-login") {
    return (
      <>
        <JsonLdScript data={org} />
        <JsonLdScript data={software} />
        <JsonLdScript data={webApp} />
        <JsonLdScript data={webPage} />
        <JsonLdScript data={breadcrumb} />
      </>
    );
  }

  if (pageId === "fasilitas-lms" || pageId === "akademik-digital") {
    return (
      <>
        <JsonLdScript data={org} />
        <JsonLdScript data={software} />
        <JsonLdScript data={webApp} />
        <JsonLdScript data={webPage} />
        <JsonLdScript data={breadcrumb} />
      </>
    );
  }

  if (pageId === "fasilitas-hub" || pageId === "akademik-kurikulum") {
    return (
      <>
        <JsonLdScript data={org} />
        <JsonLdScript data={software} />
        <JsonLdScript data={webPage} />
        <JsonLdScript data={breadcrumb} />
      </>
    );
  }

  return (
    <>
      <JsonLdScript data={webPage} />
      <JsonLdScript data={breadcrumb} />
    </>
  );
}

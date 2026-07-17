import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import type { ReactElement, ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND_LOGO_SRC, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { getPublicAppBaseUrl } from "@/lib/public-app-url";
import { LANDING_MEDIA } from "@/lib/public-media-paths";
import {
  buildLandingAbsoluteUrl,
  buildSiteVerificationMetadata,
  SEO_PRIMARY_LANGUAGE,
  SEO_PRIMARY_LOCALE,
} from "@/lib/seo";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getPublicAppBaseUrl()),
  title: {
    default: BRAND_SHORT,
    template: `%s | ${BRAND_SHORT}`,
  },
  description: `Portal resmi ${BRAND_SHORT} — ${BRAND_SCHOOL_FULL} di Pamanukan Subang Jawa Barat. SMK vokasi akreditasi A, PPDB online, LMS hybrid, jurusan TM & ULW.`,
  keywords: [
    "SMK TEKNOVO",
    "SMK Pamanukan",
    "SMK Subang",
    "PPDB SMK Pamanukan",
    "LMS online SMK",
  ],
  openGraph: {
    locale: SEO_PRIMARY_LOCALE,
    siteName: BRAND_SCHOOL_FULL,
    type: "website",
    images: [
      {
        url: buildLandingAbsoluteUrl(BRAND_LOGO_SRC),
        width: 1200,
        height: 630,
        alt: BRAND_SCHOOL_FULL,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_SHORT,
    images: [buildLandingAbsoluteUrl(BRAND_LOGO_SRC)],
  },
  alternates: {
    languages: {
      [SEO_PRIMARY_LANGUAGE]: "/",
    },
    types: {
      "application/rss+xml": [
        { url: "/berita/rss.xml", title: `Berita ${BRAND_SHORT}` },
      ],
    },
  },
  verification: buildSiteVerificationMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <ClerkProvider>
      <html lang="id" data-scroll-behavior="smooth" className={`${poppins.variable} h-full scroll-smooth antialiased`}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="alternate" type="application/rss+xml" title={`Berita ${BRAND_SHORT}`} href="/berita/rss.xml" />
          <link rel="preload" as="image" href={LANDING_MEDIA.hero.bg01Webp} fetchPriority="high" />
        </head>
        <body
          className={`${poppins.className} flex min-h-screen min-h-dvh flex-col overflow-x-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100`}
        >
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

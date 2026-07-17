import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import {
  BRAND_LOGO_SRC,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
} from "@/lib/constants";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: BRAND_SHORT,
    template: `%s | ${BRAND_SHORT}`,
  },
  description: `Portal resmi ${BRAND_SHORT} — ${BRAND_SCHOOL_FULL} di Pamanukan, Subang, Jawa Barat.`,
  openGraph: {
    locale: "id_ID",
    siteName: BRAND_SCHOOL_FULL,
    type: "website",
    images: [{ url: BRAND_LOGO_SRC, width: 512, height: 512, alt: BRAND_SCHOOL_FULL }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${poppins.variable} h-full scroll-smooth antialiased`}>
        <body
          className={`${poppins.className} flex min-h-screen min-h-dvh flex-col overflow-x-hidden bg-white text-[color:var(--color-body)]`}
        >
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

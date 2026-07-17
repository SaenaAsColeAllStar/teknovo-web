"use client";

import { Poppins } from "next/font/google";
import { useEffect } from "react";
import type { ReactElement } from "react";

import { TeknovoServerErrorPage } from "@/components/errors/TeknovoServerErrorPage";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root error boundary — menggantikan root layout saat gagal (wajib punya html/body).
 */
export default function GlobalError({
  error,
  reset,
}: GlobalErrorPageProps): ReactElement {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body
        className={`${poppins.className} min-h-dvh bg-neutral-soft font-sans text-heading`}
      >
        <TeknovoServerErrorPage reset={reset} />
      </body>
    </html>
  );
}

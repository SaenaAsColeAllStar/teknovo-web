import Link from "next/link";
import type { ReactElement } from "react";

import { SHARED_MEDIA } from "@/lib/public-media-paths";
import { type TeknovoNotFoundApp } from "@/lib/teknovo-not-found";
import { cn } from "@/lib/utils";

type TeknovoNotFoundPageProps = {
  app: TeknovoNotFoundApp;
  /** Override tautan beranda (default: `"/"`). */
  homeHref?: string;
  /**
   * Saat 404 dipicu dari rute `(site)` landing, halaman masih dibungkus `PublicSiteLayout`.
   * `fixed` menutup navbar/footer agar satu layar penuh.
   */
  escapePublicChrome?: boolean;
  className?: string;
};

/**
 * Halaman 404 bermerek SMK Teknovo.
 * Ilustrasi: R2 `media/shared/404-teknovo.webp`.
 */
export function TeknovoNotFoundPage({
  app,
  homeHref,
  escapePublicChrome = false,
  className,
}: TeknovoNotFoundPageProps): ReactElement {
  // `app` dipertahankan sebagai kontrak lintas-app, tetapi tampilan 404 ini sama untuk semua.
  void app;

  // Contract untuk tombol: selalu kembali ke root (`/`) untuk semua aplikasi.
  const home = homeHref ?? "/";

  return (
    <main
      className={cn(
        "relative isolate flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-gradient-to-b from-sky-100 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        escapePublicChrome && "fixed inset-0 z-[200]",
        className,
      )}
    >
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full">
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200/90 dark:ring-slate-700">
            <img
              src={SHARED_MEDIA.notFoundWebp}
              alt="Oops! Halaman tidak ditemukan"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-balance text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Oops! Halaman Tidak Ditemukan
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
            </p>

            <div className="mt-6">
              <Link
                href={home}
                className={cn(
                  "inline-flex min-h-12 w-[min(88vw,20rem)] items-center justify-center rounded-full",
                  "bg-[#1a8fd4] px-5 text-sm font-bold uppercase tracking-wide text-white shadow-md",
                  "transition hover:bg-[#1578b8] active:bg-[#126ba3]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a8fd4]",
                )}
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

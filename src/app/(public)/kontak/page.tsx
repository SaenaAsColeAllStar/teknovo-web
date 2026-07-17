import type { Metadata } from "next";

import {
  BRAND_MAP_EMBED_URL,
  BRAND_MAPS_URL,
  BRAND_SHORT,
  CONTACT,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Hubungi ${BRAND_SHORT} — alamat, email, dan peta lokasi.`,
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-14 md:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[color:var(--color-body-subtle)]">
          Hubungi kami
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[color:var(--color-heading)]">
          Kontak
        </h1>
        <p className="mt-3 text-[color:var(--color-body)]">
          Silakan hubungi administrasi sekolah untuk informasi PPDB, akademik,
          atau kunjungan.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 border border-[color:var(--color-border)] bg-white p-8">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-heading)]">
              Alamat
            </h2>
            <p className="mt-2 text-[color:var(--color-body)]">{CONTACT.address}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-heading)]">
              Email
            </h2>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-2 inline-block text-[color:var(--color-brand)] hover:underline"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-heading)]">
              Telepon
            </h2>
            <p className="mt-2 text-[color:var(--color-body)]">{CONTACT.phone}</p>
          </div>
          <a
            href={BRAND_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm font-medium text-[color:var(--color-brand)] hover:underline"
          >
            Buka di Google Maps →
          </a>
        </div>
        <div className="min-h-[320px] border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
          <iframe
            title={`Peta lokasi ${BRAND_SHORT}`}
            src={BRAND_MAP_EMBED_URL}
            className="h-full min-h-[320px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

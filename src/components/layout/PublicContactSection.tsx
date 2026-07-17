import type { ReactElement } from "react";

import { LandingContactForm } from "@/components/features/landing/LandingContactForm";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BRAND_MAP_EMBED_URL,
  BRAND_MAPS_URL,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
} from "@/lib/branding";
import {
  getPublikWhatsAppUrl,
  PUBLIK_CONTACT_EMAIL,
  PUBLIK_CONTACT_HOURS,
  PUBLIK_CONTACT_WA_DISPLAY,
} from "@/lib/kontak-publik";

/**
 * Blok lokasi + formulir kontak — dipakai di footer dan halaman `/kontak`.
 */
export function PublicContactSection(): ReactElement {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <MotionInView as="div" delay={0.02}>
        <p className="text-sm font-semibold uppercase tracking-wide text-heading">
          Lokasi sekolah
        </p>
        <p className="mt-2 text-sm text-body">{BRAND_SCHOOL_FULL}</p>
        <p className="mt-1 text-xs text-body-subtle">Koordinat: -6.3044, 107.816</p>
        <p className="mt-2">
          <a
            href={BRAND_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand hover:underline"
          >
            Buka di Google Maps
          </a>
        </p>
        <div className="mt-4 overflow-hidden rounded-none border border-border-default">
          <iframe
            title={`Peta lokasi ${BRAND_SHORT}`}
            src={BRAND_MAP_EMBED_URL}
            className="aspect-[16/10] w-full min-h-[220px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-xs text-body-subtle">
          Peta dari Google Maps — lokasi mengikuti titik sekolah di atas.
        </p>
      </MotionInView>

      <MotionInView as="div" delay={0.06}>
        <p className="text-sm font-semibold uppercase tracking-wide text-heading">
          Hubungi kami
        </p>
        <address className="mt-3 not-italic text-sm leading-relaxed text-body">
          <p>{PUBLIK_CONTACT_HOURS}</p>
          <p className="mt-1">
            WhatsApp:{" "}
            <a
              href={getPublikWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              {PUBLIK_CONTACT_WA_DISPLAY}
            </a>
          </p>
          <p className="mt-1">
            Email:{" "}
            <a
              href={`mailto:${PUBLIK_CONTACT_EMAIL}`}
              className="font-medium text-brand hover:underline"
            >
              {PUBLIK_CONTACT_EMAIL}
            </a>
          </p>
        </address>
        <LandingContactForm />
      </MotionInView>
    </div>
  );
}

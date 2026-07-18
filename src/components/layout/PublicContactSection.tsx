import type { ReactElement } from "react";

import { LandingContactForm } from "@/components/features/landing/LandingContactForm";
import { KontakNewsletterForm } from "@/components/features/landing/KontakNewsletterForm";
import { IcoMinus, IcoPlus } from "@/components/icons/inline-glyphs";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  BRAND_MAP_EMBED_URL,
  BRAND_MAPS_URL,
  BRAND_SHORT,
} from "@/lib/branding";
import {
  KONTAK_FAQ_EYEBROW,
  KONTAK_FAQ_ITEMS,
  KONTAK_FAQ_LEDE,
  KONTAK_FAQ_TITLE,
  KONTAK_NEWSLETTER_EYEBROW,
  KONTAK_NEWSLETTER_LEDE,
  KONTAK_NEWSLETTER_TITLE,
} from "@/lib/kontak-landing-content";
import { LOCAL_SEO_SCHOOL } from "@/lib/seo/school";
import {
  publicSectionEyebrowClassName,
  publicSectionTitleClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

/**
 * Tiga modul halaman kontak: peta + formulir, FAQ, buletin.
 * Dipakai di `/kontak` (Astro & Next).
 */
export function PublicContactSection(): ReactElement {
  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/* Module 1 — Map + contact form */}
      <MotionInView
        as="section"
        className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-stretch"
        delay={0.04}
        aria-labelledby="kontak-form-heading"
      >
        <div className="flex min-h-0 flex-col gap-3">
          <div className="overflow-hidden rounded-none border border-border-default bg-surface">
            <iframe
              title={`Peta lokasi ${BRAND_SHORT}`}
              src={BRAND_MAP_EMBED_URL}
              className="aspect-[4/3] h-full min-h-[280px] w-full border-0 lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-body-subtle">
            <p>
              {LOCAL_SEO_SCHOOL.streetAddress}, {LOCAL_SEO_SCHOOL.locality},{" "}
              {LOCAL_SEO_SCHOOL.administrativeArea}
            </p>
            <a
              href={BRAND_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              Petunjuk arah / buka Maps
            </a>
          </div>
        </div>

        <LandingContactForm />
      </MotionInView>

      {/* Module 2 — FAQ */}
      <MotionInView
        as="section"
        className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start"
        delay={0.08}
        aria-labelledby="kontak-faq-title"
      >
        <div>
          <p className={publicSectionEyebrowClassName}>{KONTAK_FAQ_EYEBROW}</p>
          <h2 id="kontak-faq-title" className={cn(publicSectionTitleClassName, "mt-3")}>
            {KONTAK_FAQ_TITLE}
          </h2>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-body">{KONTAK_FAQ_LEDE}</p>
        </div>

        <div className="divide-y divide-border-default border-y border-border-default">
          {KONTAK_FAQ_ITEMS.map((item, index) => (
            <details key={item.id} className="group py-4" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="relative mt-0.5 size-5 shrink-0 text-brand" aria-hidden>
                  <IcoPlus className="absolute inset-0 size-5 group-open:hidden" />
                  <IcoMinus className="absolute inset-0 hidden size-5 group-open:block" />
                </span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-body">{item.answer}</p>
            </details>
          ))}
        </div>
      </MotionInView>

      {/* Module 3 — Newsletter */}
      <MotionInView
        as="section"
        className="mx-auto max-w-xl text-center"
        delay={0.12}
        aria-labelledby="kontak-newsletter-title"
      >
        <p className={publicSectionEyebrowClassName}>{KONTAK_NEWSLETTER_EYEBROW}</p>
        <h2 id="kontak-newsletter-title" className={cn(publicSectionTitleClassName, "mt-3")}>
          {KONTAK_NEWSLETTER_TITLE}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body">
          {KONTAK_NEWSLETTER_LEDE}
        </p>
        <KontakNewsletterForm />
      </MotionInView>
    </div>
  );
}

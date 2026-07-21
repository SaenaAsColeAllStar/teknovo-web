import type { Kontak } from "@teknovo/shared";
import type { ReactElement } from "react";

import { LandingContactForm } from "@/components/features/landing/LandingContactForm";
import { KontakNewsletterForm } from "@/components/features/landing/KontakNewsletterForm";
import { IcoMinus, IcoPlus } from "@/components/icons/inline-glyphs";
import { MotionInView } from "@/components/motion/MotionInView";
import { BRAND_SHORT } from "@/lib/branding";
import {
  KONTAK_FAQ_EYEBROW,
  KONTAK_FAQ_ITEMS,
  KONTAK_FAQ_LEDE,
  KONTAK_FAQ_TITLE,
  KONTAK_NEWSLETTER_EYEBROW,
  KONTAK_NEWSLETTER_LEDE,
  KONTAK_NEWSLETTER_TITLE,
} from "@/lib/kontak-landing-content";
import { PUBLIK_CONTACT_EMAIL } from "@/lib/kontak-publik";
import {
  publicSectionEyebrowClassName,
  publicSectionTitleClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

function waMeUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("0") ? `62${digits.slice(1)}` : digits}`;
}

function formatJam(
  jam: NonNullable<Kontak["jamOperasional"]>[number],
): string {
  return `${jam.hari}: ${jam.buka}–${jam.tutup} WIB`;
}

function KontakDetailCard({ item }: { item: Kontak }): ReactElement {
  const socialEntries = item.mediaSosial
    ? Object.entries(item.mediaSosial).filter(([, url]) => Boolean(url?.trim()))
    : [];

  return (
    <div className="border border-border-default bg-surface p-5 sm:p-6">
      <h3 className="text-base font-semibold text-heading">{item.label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{item.alamatLengkap}</p>

      <dl className="mt-5 space-y-3 text-sm">
        {item.telepon.length > 0 ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-body-subtle">
              Telepon
            </dt>
            <dd className="mt-1 flex flex-col gap-1">
              {item.telepon.map((phone) => (
                <a
                  key={phone}
                  href={telHref(phone)}
                  className="font-medium text-brand underline-offset-2 hover:underline"
                >
                  {phone}
                </a>
              ))}
            </dd>
          </div>
        ) : null}

        {item.email.length > 0 ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-body-subtle">
              Email
            </dt>
            <dd className="mt-1 flex flex-col gap-1">
              {item.email.map((addr) => (
                <a
                  key={addr}
                  href={`mailto:${addr}`}
                  className="font-medium text-brand underline-offset-2 hover:underline"
                >
                  {addr}
                </a>
              ))}
            </dd>
          </div>
        ) : null}

        {item.whatsapp ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-body-subtle">
              WhatsApp
            </dt>
            <dd className="mt-1">
              <a
                href={waMeUrl(item.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                {item.whatsapp}
              </a>
            </dd>
          </div>
        ) : null}

        {item.jamOperasional && item.jamOperasional.length > 0 ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-body-subtle">
              Jam operasional
            </dt>
            <dd className="mt-1 space-y-0.5 text-body">
              {item.jamOperasional.map((jam) => (
                <p key={`${jam.hari}-${jam.buka}`}>{formatJam(jam)}</p>
              ))}
            </dd>
          </div>
        ) : null}

        {socialEntries.length > 0 ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-body-subtle">
              Media sosial
            </dt>
            <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {socialEntries.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize font-medium text-brand underline-offset-2 hover:underline"
                >
                  {platform}
                </a>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

/**
 * Tiga modul halaman kontak: peta + formulir, FAQ, buletin.
 * Dipakai di `/kontak` (Astro & Next).
 */
export function PublicContactSection({
  items = [],
}: {
  items?: Kontak[];
}): ReactElement {
  const primary = items[0] ?? null;
  const mapEmbed = primary?.googleMapsEmbed?.trim() || null;
  const mapUrl = primary?.googleMapsUrl?.trim() || null;
  const formEmail =
    primary?.email.find((e) => e.trim())?.trim() || PUBLIK_CONTACT_EMAIL;

  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/* Module 0 — Contact details from API */}
      {items.length > 0 ? (
        <MotionInView
          as="section"
          className={cn(
            "grid gap-4",
            items.length > 1 ? "sm:grid-cols-2" : "max-w-2xl",
          )}
          delay={0.02}
          aria-label="Informasi kontak"
        >
          {items.map((item) => (
            <KontakDetailCard key={item.id} item={item} />
          ))}
        </MotionInView>
      ) : (
        <MotionInView
          as="section"
          className="border border-border-default bg-surface px-5 py-8 text-center sm:px-8"
          delay={0.02}
          aria-live="polite"
        >
          <p className="text-sm font-medium text-heading">
            Informasi kontak belum tersedia
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body">
            Tim sekolah sedang menyiapkan detail lokasi dan saluran resmi. Anda
            tetap dapat mengirim pesan melalui formulir di bawah.
          </p>
        </MotionInView>
      )}

      {/* Module 1 — Map + contact form */}
      <MotionInView
        as="section"
        className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-stretch"
        delay={0.04}
        aria-labelledby="kontak-form-heading"
      >
        <div className="flex min-h-0 flex-col gap-3">
          {mapEmbed ? (
            <>
              <div className="overflow-hidden rounded-none border border-border-default bg-surface">
                <iframe
                  title={`Peta lokasi ${primary?.label ?? BRAND_SHORT}`}
                  src={mapEmbed}
                  className="aspect-[4/3] h-full min-h-[280px] w-full border-0 lg:min-h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-body-subtle">
                {primary?.alamatLengkap ? (
                  <p className="max-w-prose">{primary.alamatLengkap}</p>
                ) : (
                  <span />
                )}
                {mapUrl ? (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-medium text-brand underline-offset-2 hover:underline"
                  >
                    Petunjuk arah / buka Maps
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex min-h-[280px] flex-col justify-center border border-border-default bg-surface px-5 py-8 lg:min-h-[420px]">
              <p className="text-sm font-medium text-heading">Peta belum tersedia</p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {primary?.alamatLengkap
                  ? primary.alamatLengkap
                  : "Lokasi akan ditampilkan setelah data kontak dipublikasikan."}
              </p>
              {mapUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm font-medium text-brand underline-offset-2 hover:underline"
                >
                  Buka Google Maps
                </a>
              ) : null}
            </div>
          )}
        </div>

        <LandingContactForm contactEmail={formEmail} />
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

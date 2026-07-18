"use client";

import { ArrowRight, Award, Clock, Mail, Trophy } from "lucide-react";
import type { FormEvent, ReactElement } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import { Button } from "@/components/ui/button";
import { estimateReadTimeMinutes, formatReadTimeId } from "@/lib/berita-read-time";
import {
  KESISWAAN_HUB_NEWSLETTER_EMAIL_PLACEHOLDER,
  KESISWAAN_HUB_NEWSLETTER_LEDE,
  KESISWAAN_HUB_NEWSLETTER_MAIL_SUBJECT,
  KESISWAAN_HUB_NEWSLETTER_PRIVACY_AFTER,
  KESISWAAN_HUB_NEWSLETTER_PRIVACY_BEFORE,
  KESISWAAN_HUB_NEWSLETTER_PRIVACY_HREF,
  KESISWAAN_HUB_NEWSLETTER_PRIVACY_LINK_LABEL,
  KESISWAAN_HUB_NEWSLETTER_SUBMIT_LABEL,
  KESISWAAN_HUB_NEWSLETTER_TITLE,
  KESISWAAN_HUB_PRESTASI_AUTHOR_FALLBACK,
  KESISWAAN_HUB_PRESTASI_CATEGORY_FALLBACK,
  KESISWAAN_HUB_PRESTASI_LEDE,
  KESISWAAN_HUB_PRESTASI_READ_MORE_LABEL,
  KESISWAAN_HUB_PRESTASI_TITLE,
  KESISWAAN_HUB_PRESTASI_VIEW_ALL_HREF,
  KESISWAAN_HUB_PRESTASI_VIEW_ALL_LABEL,
  KESISWAAN_PRESTASI_EMPTY_BODY,
  KESISWAAN_PRESTASI_EMPTY_TITLE,
} from "@/lib/kesiswaan-landing-content";
import { PUBLIK_CONTACT_EMAIL } from "@/lib/kontak-publik";
import { publicFormalBodyClassName } from "@/lib/public-section-styles";
import type { PrestasiPublikCard } from "@/services/kesiswaan-publik";
import { cn, formatDateId, formatRelativeTimeId } from "@/lib/utils";

const HUB_PRESTASI_LIMIT = 4;

export type KesiswaanPrestasiBlogSectionProps = {
  prestasiItems: PrestasiPublikCard[];
};

function prestasiCategoryLabel(item: PrestasiPublikCard): string {
  const haystack = `${item.judul} ${item.penyelenggara} ${item.siswaLabel}`.toLowerCase();
  if (/futsal|silat|olahraga|o2sn|atlet/.test(haystack)) return "Olahraga";
  if (/robot|coding|hackathon|teknologi|digital|program/.test(haystack)) return "Teknologi";
  if (/blog|tulis|literasi|artikel/.test(haystack)) return "Literasi";
  return KESISWAAN_HUB_PRESTASI_CATEGORY_FALLBACK;
}

function authorInitials(label: string): string {
  const parts = label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "TK";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function PrestasiBlogCard({ item }: { item: PrestasiPublikCard }): ReactElement {
  const category = prestasiCategoryLabel(item);
  const published = new Date(item.tanggalIso);
  const relative = formatRelativeTimeId(published);
  const author = item.siswaLabel.trim() || KESISWAAN_HUB_PRESTASI_AUTHOR_FALLBACK;
  const readLabel = formatReadTimeId(
    estimateReadTimeMinutes(`${item.judul} ${item.ringkasan} ${item.penyelenggara}`),
  );
  const detailHref = item.fileUrl;
  const isExternal = /^https?:\/\//i.test(detailHref);

  const headlineClass =
    "text-base font-bold leading-snug tracking-tight text-heading transition-colors hover:text-brand sm:text-lg";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border-default bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-neutral-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
          <Trophy className="size-3 shrink-0" aria-hidden />
          {category}
        </span>
        <time
          dateTime={item.tanggalIso}
          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-body-subtle"
        >
          <Clock className="size-3 shrink-0" aria-hidden />
          {relative}
        </time>
      </div>

      <h3 className="mt-4">
        {isExternal ? (
          <a
            href={detailHref}
            target="_blank"
            rel="noopener noreferrer"
            className={headlineClass}
          >
            {item.judul}
          </a>
        ) : (
          <PublicSiteLink href={detailHref} className={headlineClass}>
            {item.judul}
          </PublicSiteLink>
        )}
      </h3>

      <p
        className={cn(
          "mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-body",
          publicFormalBodyClassName,
        )}
      >
        {item.ringkasan || `Diselenggarakan oleh ${item.penyelenggara}.`}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-default pt-4">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand"
          aria-hidden
        >
          {authorInitials(author)}
        </span>
        <div className="min-w-0 flex-1 basis-[8rem]">
          <p className="truncate text-sm font-semibold text-heading">{author}</p>
          <p className="truncate text-xs text-body-subtle">
            {formatDateId(published)}
            <span className="mx-1.5 text-border-default" aria-hidden>
              ·
            </span>
            {readLabel}
          </p>
        </div>
        {isExternal ? (
          <a
            href={detailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            {KESISWAAN_HUB_PRESTASI_READ_MORE_LABEL}
            <ArrowRight className="size-3.5" aria-hidden />
          </a>
        ) : (
          <PublicSiteLink
            href={detailHref}
            className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            {KESISWAAN_HUB_PRESTASI_READ_MORE_LABEL}
            <ArrowRight className="size-3.5" aria-hidden />
          </PublicSiteLink>
        )}
      </div>
    </article>
  );
}

function PrestasiNewsletterBlock(): ReactElement {
  function onSubscribe(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) return;
    const body = `Mohon daftarkan alamat berikut ke buletin sekolah:\n${email}`;
    window.location.href = `mailto:${PUBLIK_CONTACT_EMAIL}?subject=${encodeURIComponent(KESISWAAN_HUB_NEWSLETTER_MAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="mt-12 sm:mt-14">
      <h3 className="text-lg font-bold tracking-tight text-heading sm:text-xl">
        {KESISWAAN_HUB_NEWSLETTER_TITLE}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-prose text-sm leading-relaxed text-body",
          publicFormalBodyClassName,
        )}
      >
        {KESISWAAN_HUB_NEWSLETTER_LEDE}
      </p>

      <form
        className="mt-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
        onSubmit={onSubscribe}
        noValidate
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{KESISWAAN_HUB_NEWSLETTER_EMAIL_PLACEHOLDER}</span>
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body-subtle"
            aria-hidden
          />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={KESISWAAN_HUB_NEWSLETTER_EMAIL_PLACEHOLDER}
            className="h-10 w-full rounded-full border border-border-default bg-surface pl-10 pr-4 text-sm text-heading placeholder:text-body-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </label>
        <Button type="submit" size="sm" className="h-10 shrink-0 rounded-full px-5">
          {KESISWAAN_HUB_NEWSLETTER_SUBMIT_LABEL}
        </Button>
      </form>

      <p className="mt-3 max-w-xl text-xs leading-relaxed text-body-subtle">
        {KESISWAAN_HUB_NEWSLETTER_PRIVACY_BEFORE}
        <PublicSiteLink
          href={KESISWAAN_HUB_NEWSLETTER_PRIVACY_HREF}
          className="font-medium text-brand underline-offset-2 hover:underline"
        >
          {KESISWAAN_HUB_NEWSLETTER_PRIVACY_LINK_LABEL}
        </PublicSiteLink>
        {KESISWAAN_HUB_NEWSLETTER_PRIVACY_AFTER}
      </p>
    </div>
  );
}

/**
 * Blog-style prestasi block for the kesiswaan hub (`article#prestasi`).
 */
export function KesiswaanPrestasiBlogSection({
  prestasiItems,
}: KesiswaanPrestasiBlogSectionProps): ReactElement {
  const items = prestasiItems.slice(0, HUB_PRESTASI_LIMIT);

  return (
    <MotionInView as="article" id="prestasi" className="scroll-mt-24 mt-14 w-full min-w-0" delay={0.1}>
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-4xl">
            {KESISWAAN_HUB_PRESTASI_TITLE}
          </h2>
          <PublicSiteLink
            href={KESISWAAN_HUB_PRESTASI_VIEW_ALL_HREF}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-neutral-soft px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:border-brand/40 hover:bg-brand/5"
          >
            {KESISWAAN_HUB_PRESTASI_VIEW_ALL_LABEL}
            <ArrowRight className="size-3.5" aria-hidden />
          </PublicSiteLink>
        </div>
        <p
          className={cn(
            "mt-4 max-w-prose text-sm leading-relaxed text-body sm:text-[15px]",
            publicFormalBodyClassName,
          )}
        >
          {KESISWAAN_HUB_PRESTASI_LEDE}
        </p>
      </header>

      {items.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <PrestasiBlogCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border-default bg-neutral-soft px-5 py-10 text-center">
          <Award className="mx-auto size-8 text-brand" aria-hidden />
          <p className="mt-3 text-base font-semibold text-heading">{KESISWAAN_PRESTASI_EMPTY_TITLE}</p>
          <p className={cn("mx-auto mt-2 max-w-md text-sm text-body", publicFormalBodyClassName)}>
            {KESISWAAN_PRESTASI_EMPTY_BODY}
          </p>
        </div>
      )}

      <PrestasiNewsletterBlock />
    </MotionInView>
  );
}

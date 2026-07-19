"use client";

import {
  SEO_META_DESCRIPTION_IDEAL,
  SEO_META_DESCRIPTION_MAX,
  SEO_META_KEYWORDS_MAX,
  SEO_META_TITLE_IDEAL,
  SEO_META_TITLE_MAX,
  generateArticleSeo,
  type ArticleSeoKind,
} from "@teknovo/shared";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  kind: ArticleSeoKind;
  disabled?: boolean;
  // Forms pass their full schema; we only touch the SEO slice.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  kategoriNama?: string | null;
  siteBaseUrl?: string;
};

function CharCount({
  value,
  ideal,
  max,
}: {
  value: string;
  ideal: number;
  max: number;
}) {
  const len = value.length;
  const tone =
    len === 0
      ? "text-[color:var(--color-body-subtle)]"
      : len > max
        ? "text-[color:var(--color-danger)]"
        : len > ideal
          ? "text-[color:var(--color-body)]"
          : "text-[color:var(--color-body-subtle)]";
  return (
    <span className={`text-xs ${tone}`}>
      {len}/{max}
      {len > 0 && len <= ideal ? " · ideal" : null}
    </span>
  );
}

/**
 * SEO fieldset shared by berita & artikel siswa forms.
 * "Generate metadata" fills fields from judul/ringkasan/konten via @teknovo/shared.
 */
export function ArticleSeoFields({
  kind,
  disabled,
  register,
  watch,
  setValue,
  errors,
  kategoriNama,
  siteBaseUrl = "https://smkteknovo.sch.id",
}: Props) {
  const metaTitle = watch("metaTitle") ?? "";
  const metaDescription = watch("metaDescription") ?? "";
  const metaKeywords = watch("metaKeywords") ?? "";

  function onGenerate() {
    const judul = watch("judul")?.trim() || "";
    if (judul.length < 3) {
      toast.error("Isi judul dulu sebelum generate SEO.");
      return;
    }
    const seo = generateArticleSeo({
      judul,
      ringkasan: watch("ringkasan"),
      konten: watch("konten"),
      kategoriNama: kategoriNama ?? null,
      coverUrl: watch("coverUrl"),
      slug: watch("slug"),
      kind,
      siteName: "TEKNOVO",
      siteBaseUrl,
    });
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    setValue("metaTitle", seo.metaTitle, opts);
    setValue("metaDescription", seo.metaDescription, opts);
    setValue("metaKeywords", seo.metaKeywords, opts);
    setValue("ogImageUrl", seo.ogImageUrl, opts);
    setValue("canonicalUrl", seo.canonicalUrl, opts);
    toast.success("Metadata SEO digenerate — boleh diedit sebelum simpan.");
  }

  return (
    <fieldset className="space-y-4 border border-[color:var(--color-border)] p-4">
      <legend className="px-1 text-sm font-semibold text-[color:var(--color-brand)]">
        SEO & metadata
      </legend>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-xs text-[color:var(--color-body-subtle)]">
          Kosongkan untuk memakai judul / ringkasan / cover sebagai fallback
          publik. Generate memakai judul, ringkasan, konten, dan kategori
          (batas Google: judul ~50–60, deskripsi ~150–160).
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled}
          onClick={onGenerate}
        >
          Generate metadata
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="metaTitle">
            Meta title{" "}
            <span className="font-normal text-[color:var(--color-body-subtle)]">
              (ideal ≤{SEO_META_TITLE_IDEAL}, max {SEO_META_TITLE_MAX})
            </span>
          </Label>
          <CharCount
            value={metaTitle}
            ideal={SEO_META_TITLE_IDEAL}
            max={SEO_META_TITLE_MAX}
          />
        </div>
        <Input
          id="metaTitle"
          disabled={disabled}
          maxLength={SEO_META_TITLE_MAX}
          {...register("metaTitle")}
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="metaDescription">
            Meta description{" "}
            <span className="font-normal text-[color:var(--color-body-subtle)]">
              (ideal ≤{SEO_META_DESCRIPTION_IDEAL}, max{" "}
              {SEO_META_DESCRIPTION_MAX})
            </span>
          </Label>
          <CharCount
            value={metaDescription}
            ideal={SEO_META_DESCRIPTION_IDEAL}
            max={SEO_META_DESCRIPTION_MAX}
          />
        </div>
        <textarea
          id="metaDescription"
          rows={3}
          maxLength={SEO_META_DESCRIPTION_MAX}
          disabled={disabled}
          className="flex min-h-[5rem] w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:opacity-50"
          {...register("metaDescription")}
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="metaKeywords">
            Meta keywords{" "}
            <span className="font-normal text-[color:var(--color-body-subtle)]">
              (opsional, max {SEO_META_KEYWORDS_MAX})
            </span>
          </Label>
          <CharCount
            value={metaKeywords}
            ideal={SEO_META_KEYWORDS_MAX}
            max={SEO_META_KEYWORDS_MAX}
          />
        </div>
        <Input
          id="metaKeywords"
          disabled={disabled}
          maxLength={SEO_META_KEYWORDS_MAX}
          placeholder="berita sekolah, TEKNOVO, …"
          {...register("metaKeywords")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ogImageUrl">OG image URL</Label>
          <Input
            id="ogImageUrl"
            disabled={disabled}
            placeholder="https://… (kosong = cover)"
            {...register("ogImageUrl")}
          />
          {typeof errors.ogImageUrl?.message === "string" ? (
            <p className="text-xs text-[color:var(--color-danger)]">
              {errors.ogImageUrl.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">Canonical URL</Label>
          <Input
            id="canonicalUrl"
            disabled={disabled}
            placeholder="https://… (opsional)"
            {...register("canonicalUrl")}
          />
          {typeof errors.canonicalUrl?.message === "string" ? (
            <p className="text-xs text-[color:var(--color-danger)]">
              {errors.canonicalUrl.message}
            </p>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Eye } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import DOMPurify from "isomorphic-dompurify";
import {
  generateArticleSeo,
} from "@teknovo/shared";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { BeritaRichTextEditor } from "@/components/dashboard/berita/BeritaRichTextEditor";
import { CoverImageDropzone } from "@/components/dashboard/media/CoverImageDropzone";
import { MediaLibrary } from "@/components/dashboard/media/MediaLibrary";
import { ArticleSeoFields } from "@/components/dashboard/seo/ArticleSeoFields";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  beritaFormSchema,
  createBerita,
  deleteBerita,
  isApiConfigured,
  slugifyJudul,
  updateBerita,
  type BeritaFormValues,
} from "@/lib/api-client";
import { revalidateBeritaCache } from "@/lib/cms-revalidate";
import { calculateReadability } from "@/lib/readability";
import type { Berita } from "@/types/berita";
import type { Kategori } from "@/types/kategori";

type Props = {
  mode: "create" | "edit";
  initial?: Berita;
  kategori: Kategori[];
};

const selectClassName =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20 disabled:cursor-not-allowed disabled:opacity-50";

const AUTOSAVE_MS = 30_000;

export function BeritaForm({ mode, initial, kategori }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { canWrite } = useCmsRole();
  const [busy, setBusy] = useState<"draft" | "publish" | "delete" | null>(null);
  const [slugLocked, setSlugLocked] = useState(
    Boolean(initial?.slug) || mode === "edit",
  );
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [seoManuallyEdited, setSeoManuallyEdited] = useState(
    Boolean(
      initial?.metaTitle ||
        initial?.metaDescription ||
        initial?.metaKeywords ||
        initial?.ogImageUrl ||
        initial?.canonicalUrl,
    ),
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lastAutosaveAt, setLastAutosaveAt] = useState<string | null>(null);
  const apiReady = isApiConfigured();
  const readOnly = !canWrite;
  const autosaveBusy = useRef(false);

  const form = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaFormSchema),
    defaultValues: {
      judul: initial?.judul ?? "",
      slug: initial?.slug ?? "",
      ringkasan: initial?.ringkasan ?? "",
      konten: initial?.konten ?? "",
      kategoriId: initial?.kategori?.id ?? "",
      status: initial?.status ?? "DRAFT",
      coverUrl: initial?.coverUrl ?? "",
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
      metaKeywords: initial?.metaKeywords ?? "",
      ogImageUrl: initial?.ogImageUrl ?? "",
      canonicalUrl: initial?.canonicalUrl ?? "",
    },
  });

  const watchedKategoriId = form.watch("kategoriId");
  const watchedJudul = form.watch("judul");
  const watchedRingkasan = form.watch("ringkasan");
  const watchedKonten = form.watch("konten");
  const watchedSlug = form.watch("slug");
  const kategoriNama =
    kategori.find((k) => k.id === watchedKategoriId)?.nama ?? null;

  const readability = calculateReadability(watchedKonten ?? "");

  useEffect(() => {
    if (seoManuallyEdited || !watchedJudul || watchedJudul.trim().length < 3) {
      return;
    }
    const handle = window.setTimeout(() => {
      const seo = generateArticleSeo({
        judul: watchedJudul,
        ringkasan: watchedRingkasan,
        konten: watchedKonten,
        kategoriNama,
        coverUrl: form.getValues("coverUrl"),
        slug: form.getValues("slug"),
        kind: "berita",
        siteName: "TEKNOVO",
        siteBaseUrl: "https://smkteknovo.sch.id",
      });
      const opts = { shouldDirty: false, shouldValidate: false } as const;
      form.setValue("metaTitle", seo.metaTitle, opts);
      form.setValue("metaDescription", seo.metaDescription, opts);
      form.setValue("metaKeywords", seo.metaKeywords, opts);
      form.setValue("ogImageUrl", seo.ogImageUrl, opts);
      form.setValue("canonicalUrl", seo.canonicalUrl, opts);
    }, 500);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberate SEO watch set
  }, [
    watchedJudul,
    watchedRingkasan,
    watchedKonten,
    watchedSlug,
    kategoriNama,
    seoManuallyEdited,
  ]);

  async function withToken() {
    const token = await getToken();
    if (!token) {
      throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
    }
    return token;
  }

  async function save(
    values: BeritaFormValues,
    intent: "draft" | "publish",
    opts?: { silent?: boolean },
  ) {
    if (readOnly) {
      if (!opts?.silent) {
        toast.error("Peran viewer tidak dapat menyimpan berita.");
      }
      return;
    }
    if (!apiReady) {
      if (!opts?.silent) {
        toast.error("API belum dikonfigurasi", {
          description:
            "Set VITE_API_URL (CMS) ke base API, misalnya https://cf.smkteknovo.sch.id/api.",
        });
      }
      return;
    }

    const payload: BeritaFormValues = {
      ...values,
      status:
        intent === "publish"
          ? "PUBLISHED"
          : mode === "create"
            ? "DRAFT"
            : values.status,
    };

    if (!opts?.silent) setBusy(intent);
    try {
      const token = await withToken();
      const saved =
        mode === "create"
          ? await createBerita(payload, token)
          : await updateBerita(initial!.id, payload, token);

      if (saved.status === "PUBLISHED") {
        try {
          await revalidateBeritaCache(saved.slug);
        } catch {
          /* revalidate is best-effort */
        }
      }

      if (opts?.silent) {
        setLastAutosaveAt(new Date().toLocaleTimeString("id-ID"));
      } else {
        toast.success(
          saved.status === "PUBLISHED"
            ? "Berita dipublikasikan"
            : "Draft disimpan",
        );
        router.push(`/dashboard/berita/${saved.id}/edit`);
        router.refresh();
      }
    } catch (err) {
      if (!opts?.silent) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : "Gagal menyimpan berita.";
        toast.error(message);
      }
    } finally {
      if (!opts?.silent) setBusy(null);
    }
  }

  useEffect(() => {
    if (readOnly || !apiReady || mode !== "edit" || !initial) return;
    const id = window.setInterval(() => {
      if (autosaveBusy.current || busy || !form.formState.isDirty) return;
      autosaveBusy.current = true;
      void form
        .handleSubmit(async (values) => {
          await save(values, "draft", { silent: true });
        })()
        .finally(() => {
          autosaveBusy.current = false;
        });
    }, AUTOSAVE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initial?.id, readOnly, apiReady, busy]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void form.handleSubmit((values) => save(values, "draft"))();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        void form.handleSubmit((values) => save(values, "publish"))();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete() {
    if (!initial || !apiReady || readOnly) return;
    if (!window.confirm(`Hapus berita "${initial.judul}"?`)) return;

    setBusy("delete");
    try {
      const token = await withToken();
      await deleteBerita(initial.id, token);
      try {
        await revalidateBeritaCache(initial.slug);
      } catch {
        /* ignore */
      }
      toast.success("Berita dihapus");
      router.push("/dashboard/berita");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menghapus berita.",
      );
    } finally {
      setBusy(null);
    }
  }

  const previewHtml = DOMPurify.sanitize(watchedKonten || "");

  return (
    <>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((values) => save(values, "draft"))}
      >
        {!apiReady ? (
          <div
            role="alert"
            className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
          >
            <p className="font-medium text-[color:var(--color-heading)]">
              API_URL belum diset
            </p>
            <p className="mt-1">
              Tambahkan <code>API_URL</code> / <code>VITE_API_URL</code> ke base
              API cms-api.
            </p>
          </div>
        ) : null}

        <FormSection
          title="Informasi dasar"
          description="Judul, slug, dan ringkasan"
        >
          <div className="space-y-2">
            <Label htmlFor="judul">Judul</Label>
            <Input
              id="judul"
              disabled={!!busy || readOnly}
              {...form.register("judul", {
                onChange: (event) => {
                  if (slugLocked || readOnly) return;
                  const next = slugifyJudul(event.target.value);
                  if (next) form.setValue("slug", next, { shouldValidate: true });
                },
              })}
            />
            {form.formState.errors.judul ? (
              <p className="text-xs text-[color:var(--color-danger)]">
                {form.formState.errors.judul.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              disabled={!!busy || readOnly}
              {...form.register("slug", {
                onChange: () => {
                  setSlugLocked(true);
                },
              })}
              placeholder="contoh-berita"
            />
            {form.formState.errors.slug ? (
              <p className="text-xs text-[color:var(--color-danger)]">
                {form.formState.errors.slug.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ringkasan">Ringkasan</Label>
            <Input
              id="ringkasan"
              disabled={!!busy || readOnly}
              {...form.register("ringkasan")}
            />
          </div>
        </FormSection>

        <FormSection
          title="Media & kategori"
          description="Cover, kategori, status"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Cover</Label>
              {canWrite ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={!!busy}
                  onClick={() => setShowMediaPicker((v) => !v)}
                >
                  {showMediaPicker ? "Tutup library" : "Pilih dari media"}
                </Button>
              ) : null}
            </div>
            <CoverImageDropzone
              value={form.watch("coverUrl") ?? ""}
              onChange={(url) =>
                form.setValue("coverUrl", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={!!busy || readOnly}
            />
            {form.formState.errors.coverUrl ? (
              <p className="text-xs text-[color:var(--color-danger)]">
                {form.formState.errors.coverUrl.message}
              </p>
            ) : null}
            {showMediaPicker ? (
              <div className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] p-3">
                <p className="mb-3 text-xs text-[color:var(--color-body)]">
                  Klik thumbnail untuk mengisi cover URL.
                </p>
                <MediaLibrary
                  compact
                  fetchOnMount
                  onPick={(url) => {
                    form.setValue("coverUrl", url, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setShowMediaPicker(false);
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kategoriId">Kategori</Label>
              <select
                id="kategoriId"
                className={selectClassName}
                disabled={!!busy || readOnly}
                {...form.register("kategoriId")}
              >
                <option value="">— Tanpa kategori —</option>
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className={selectClassName}
                disabled={!!busy || readOnly}
                {...form.register("status")}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Konten" description="Isi berita dengan editor">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Konten</Label>
            {readability > 0 ? (
              <span
                className={
                  readability >= 60
                    ? "text-xs text-[color:var(--color-success)]"
                    : readability >= 40
                      ? "text-xs text-amber-600"
                      : "text-xs text-[color:var(--color-danger)]"
                }
              >
                Readability: {readability}/100
                {readability < 40 ? " · Terlalu kompleks" : null}
              </span>
            ) : null}
          </div>
          <Controller
            control={form.control}
            name="konten"
            render={({ field }) => (
              <BeritaRichTextEditor
                value={field.value}
                onChange={field.onChange}
                disabled={!!busy || readOnly}
              />
            )}
          />
          {form.formState.errors.konten ? (
            <p className="text-xs text-[color:var(--color-danger)]">
              {form.formState.errors.konten.message}
            </p>
          ) : null}
        </FormSection>

        <FormSection
          title="SEO & metadata"
          description="Optimasi mesin pencari — auto-fill saat mengetik (override manual menghentikan auto)"
        >
          <ArticleSeoFields
            kind="berita"
            disabled={!!busy || readOnly}
            register={form.register}
            watch={form.watch}
            setValue={form.setValue}
            errors={form.formState.errors}
            kategoriNama={kategoriNama}
            seoManuallyEdited={seoManuallyEdited}
            onSeoManualEdit={() => setSeoManuallyEdited(true)}
          />
        </FormSection>

        {canWrite ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)] pt-4">
            <Button type="submit" size="sm" variant="secondary" disabled={!!busy}>
              {busy === "draft" ? "Menyimpan…" : "Simpan draft"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!!busy}
              onClick={form.handleSubmit((values) => save(values, "publish"))}
            >
              {busy === "publish" ? "Mempublikasi…" : "Publikasikan"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!!busy}
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-1.5 size-3.5" aria-hidden />
              Pratinjau
            </Button>
            {lastAutosaveAt ? (
              <span className="text-xs text-[color:var(--color-body-subtle)]">
                Autosave {lastAutosaveAt}
              </span>
            ) : null}
            {mode === "edit" ? (
              <Button
                type="button"
                size="sm"
                variant="danger"
                className="ml-auto"
                disabled={!!busy}
                onClick={onDelete}
              >
                {busy === "delete" ? "Menghapus…" : "Hapus"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </form>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau berita"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="my-8 w-full max-w-3xl border border-[color:var(--color-border)] bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[color:var(--color-body-subtle)]">
                  Pratinjau
                </p>
                <h2 className="text-xl font-semibold text-[color:var(--color-heading)]">
                  {watchedJudul || "Tanpa judul"}
                </h2>
                {watchedRingkasan ? (
                  <p className="mt-1 text-sm text-[color:var(--color-body)]">
                    {watchedRingkasan}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setPreviewOpen(false)}
              >
                Tutup
              </Button>
            </div>
            <div
              className="prose prose-sm max-w-none text-[color:var(--color-heading)]"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

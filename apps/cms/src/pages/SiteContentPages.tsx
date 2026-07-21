"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { SortableContentRows, SortableHandleHeader } from "@/components/dashboard/site-content/SortableContentRows";
import { CoverImageDropzone } from "@/components/dashboard/media/CoverImageDropzone";
import { FormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createEkstrakurikuler,
  createFasilitas,
  createPrestasi,
  deleteEkstrakurikuler,
  deleteFasilitas,
  deletePrestasi,
  ekstrakurikulerFormSchema,
  fasilitasFormSchema,
  fetchEkstrakurikulerById,
  fetchEkstrakurikulerListCms,
  fetchFasilitasById,
  fetchFasilitasListCms,
  fetchPrestasiById,
  fetchPrestasiListCms,
  prestasiFormSchema,
  slugifyJudul,
  updateEkstrakurikuler,
  updateFasilitas,
  updatePrestasi,
  type Ekstrakurikuler,
  type EkstrakurikulerFormValues,
  type EkstrakurikulerListItem,
  type Fasilitas,
  type FasilitasFormValues,
  type FasilitasListItem,
  type Prestasi,
  type PrestasiFormValues,
  type PrestasiListItem,
} from "@/lib/api-client";

import { SiteContentReviewNoteBanner, SiteContentSubmitButton } from "../components/dashboard/moderasi/SiteContentSubmitButton";
import {
  DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  SiteContentLayoutConfigFields,
} from "../components/dashboard/SiteContentLayoutConfigFields";
import { useCmsGetToken } from "../lib/use-cms-get-token";
import { onRouterRefresh } from "../shims/next-navigation";
import type { SiteContentLayoutConfig } from "@teknovo/shared";

const selectClassName =
  "flex h-10 w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20";

const textareaClassName =
  "min-h-[88px] w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[] | undefined): string {
  return (value ?? []).join("\n");
}

/* ─── Fasilitas ─────────────────────────────────────────────────── */

export function FasilitasListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<FasilitasListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchFasilitasListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat fasilitas.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const unsubscribe = onRouterRefresh(() => void load());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Fasilitas
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Kelola halaman fasilitas yang tampil di situs publik. Setelah terbit,
            situs di-rebuild otomatis.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/fasilitas/baru">Fasilitas baru</Link>
          </Button>
        ) : null}
      </div>
      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak dapat memuat</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
              <tr>
                {canManageSiteContent ? <SortableHandleHeader /> : null}
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Nav</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              <SortableContentRows
                entity="fasilitas"
                items={items}
                setItems={setItems}
                getToken={getToken}
                enabled={canManageSiteContent && items.length > 0}
              >
                {(row, handle) => (
                  <>
                    {handle ? (
                      <td className="px-2 py-3 align-middle">{handle}</td>
                    ) : null}
                    <td className="px-4 py-3">
                      <div className="font-medium text-[color:var(--color-heading)]">
                        {row.title}
                      </div>
                      <div className="text-xs text-[color:var(--color-body)]">
                        /fasilitas/{row.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.showInNav ? row.navLabel : "—"}
                    </td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/fasilitas/${row.id}/edit`}>Edit</Link>
                        </Button>
                        {canManageSiteContent ? (
                          <SiteContentSubmitButton
                            entity="fasilitas"
                            id={row.id}
                            status={row.status}
                            onDone={() =>
                              setItems((prev) =>
                                prev.map((x) =>
                                  x.id === row.id
                                    ? {
                                        ...x,
                                        status: "PENDING_REVIEW" as const,
                                        reviewNote: null,
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                        ) : null}
                      </div>
                    </td>
                  </>
                )}
              </SortableContentRows>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManageSiteContent ? 6 : 5}
                    className="px-4 py-8 text-center text-[color:var(--color-body)]"
                  >
                    Belum ada fasilitas. Buat entri pertama atau seed dari data
                    hardcoded saat migrasi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function FasilitasFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Fasilitas | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [navLabel, setNavLabel] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [highlights, setHighlights] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<
    "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED"
  >("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchFasilitasById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setTitle(row.title);
        setSlug(row.slug);
        setSlugLocked(true);
        setNavLabel(row.navLabel);
        setDescription(row.description);
        setCoverUrl(row.coverUrl ?? "");
        setHighlights(arrayToLines(row.highlights));
        setParagraphs(arrayToLines(row.paragraphs));
        setSortOrder(row.sortOrder);
        setShowInNav(row.showInNav);
        setLayoutConfig(row.layoutConfig ?? { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG });
        setStatus(row.status);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken, isLoaded]);

  async function save(nextStatus: "DRAFT" | "PUBLISHED") {
    if (!canManageSiteContent) {
      toast.error("Peran Anda tidak dapat menyimpan fasilitas.");
      return;
    }
    const payload: FasilitasFormValues = {
      title,
      slug,
      navLabel: navLabel || title,
      description,
      coverUrl: coverUrl || "",
      highlights: linesToArray(highlights),
      paragraphs: linesToArray(paragraphs),
      extras: initial?.extras ?? {},
      layoutConfig,
      sortOrder,
      showInNav,
      status: nextStatus,
    };
    const parsed = fasilitasFormSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Validasi gagal");
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const saved =
        mode === "create"
          ? await createFasilitas(parsed.data, token)
          : await updateFasilitas(initial!.id, parsed.data, token);
      toast.success(
        saved.status === "PUBLISHED" ? "Fasilitas dipublikasikan" : "Draft disimpan",
      );
      navigate(`/fasilitas/${saved.id}/edit`);
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyimpan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial || !canManageSiteContent) return;
    if (!window.confirm(`Hapus fasilitas "${initial.title}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteFasilitas(initial.id, token);
      toast.success("Fasilitas dihapus");
      navigate("/fasilitas");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menghapus.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {mode === "create" ? "Fasilitas baru" : "Edit fasilitas"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Label navigasi muncul di grup Fasilitas setelah konten diterbitkan.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/fasilitas">Kembali</Link>
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void save("DRAFT");
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="f-title">Judul</Label>
            <Input
              id="f-title"
              value={title}
              disabled={!canManageSiteContent}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugLocked) setSlug(slugifyJudul(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="f-slug">Slug</Label>
              <Input
                id="f-slug"
                value={slug}
                disabled={!canManageSiteContent || slugLocked}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-nav">Label navbar</Label>
              <Input
                id="f-nav"
                value={navLabel}
                disabled={!canManageSiteContent}
                onChange={(e) => setNavLabel(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f-desc">Deskripsi</Label>
            <textarea
              id="f-desc"
              className={textareaClassName}
              value={description}
              disabled={!canManageSiteContent}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Cover</Label>
            <CoverImageDropzone
              value={coverUrl}
              onChange={setCoverUrl}
              disabled={!canManageSiteContent}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="f-hl">Highlights (satu baris per item)</Label>
            <textarea
              id="f-hl"
              className={textareaClassName}
              value={highlights}
              disabled={!canManageSiteContent}
              onChange={(e) => setHighlights(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="f-p">Paragraf (satu baris per paragraf)</Label>
            <textarea
              id="f-p"
              className={textareaClassName}
              value={paragraphs}
              disabled={!canManageSiteContent}
              onChange={(e) => setParagraphs(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="f-order">Urutan</Label>
              <Input
                id="f-order"
                type="number"
                value={sortOrder}
                disabled={!canManageSiteContent}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-status">Status</Label>
              <select
                id="f-status"
                className={selectClassName}
                value={status}
                disabled={!canManageSiteContent}
                onChange={(e) =>
                  setStatus(e.target.value as typeof status)
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={showInNav}
                disabled={!canManageSiteContent}
                onChange={(e) => setShowInNav(e.target.checked)}
              />
              Tampil di navbar
            </label>
          </div>
          <SiteContentLayoutConfigFields
            value={layoutConfig}
            onChange={setLayoutConfig}
            disabled={!canManageSiteContent}
          />
          {mode === "edit" && initial ? (
            <SiteContentReviewNoteBanner
              status={status}
              reviewNote={initial.reviewNote}
            />
          ) : null}
          {canManageSiteContent ? (
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={busy} variant="secondary">
                Simpan draft
              </Button>
              <Button
                type="button"
                disabled={busy}
                onClick={() => void save("PUBLISHED")}
              >
                Publikasikan
              </Button>
              {mode === "edit" && id ? (
                <SiteContentSubmitButton
                  entity="fasilitas"
                  id={id}
                  status={status}
                  disabled={busy}
                  size="default"
                  onDone={() => setStatus("PENDING_REVIEW")}
                />
              ) : null}
              {mode === "edit" ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void onDelete()}
                >
                  Hapus
                </Button>
              ) : null}
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}

/* ─── Ekstrakurikuler ───────────────────────────────────────────── */

export function EkstrakurikulerListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<EkstrakurikulerListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchEkstrakurikulerListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const unsubscribe = onRouterRefresh(() => void load());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Ekstrakurikuler
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Unit ekstrakurikuler di halaman kesiswaan.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/ekstrakurikuler/baru">Unit baru</Link>
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
              <tr>
                {canManageSiteContent ? <SortableHandleHeader /> : null}
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              <SortableContentRows
                entity="ekstrakurikuler"
                items={items}
                setItems={setItems}
                getToken={getToken}
                enabled={canManageSiteContent && items.length > 0}
              >
                {(row, handle) => (
                  <>
                    {handle ? (
                      <td className="px-2 py-3 align-middle">{handle}</td>
                    ) : null}
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3">{row.kategori}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/ekstrakurikuler/${row.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        {canManageSiteContent ? (
                          <SiteContentSubmitButton
                            entity="ekstrakurikuler"
                            id={row.id}
                            status={row.status}
                            onDone={() =>
                              setItems((prev) =>
                                prev.map((x) =>
                                  x.id === row.id
                                    ? {
                                        ...x,
                                        status: "PENDING_REVIEW" as const,
                                        reviewNote: null,
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                        ) : null}
                      </div>
                    </td>
                  </>
                )}
              </SortableContentRows>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManageSiteContent ? 5 : 4}
                    className="px-4 py-8 text-center text-[color:var(--color-body)]"
                  >
                    Belum ada unit ekstrakurikuler.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function EkstrakurikulerFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Ekstrakurikuler | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [detail, setDetail] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [kategori, setKategori] = useState<
    "TEKNOLOGI" | "OLAHRAGA" | "AKADEMIK" | "SENI"
  >("TEKNOLOGI");
  const [previewUrl, setPreviewUrl] = useState("");
  const [achievements, setAchievements] = useState("");
  const [jadwalRingkas, setJadwalRingkas] = useState("");
  const [lokasiLatihan, setLokasiLatihan] = useState("");
  const [pembinaNama, setPembinaNama] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<
    "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED"
  >("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchEkstrakurikulerById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setName(row.name);
        setSlug(row.slug);
        setDetail(row.detail);
        setFullDescription(row.fullDescription);
        setKategori(row.kategori);
        setPreviewUrl(row.previewUrl ?? "");
        setAchievements(arrayToLines(row.relatedAchievements));
        setJadwalRingkas(row.jadwalRingkas ?? "");
        setLokasiLatihan(row.lokasiLatihan ?? "");
        setPembinaNama(row.pembinaNama ?? "");
        setSortOrder(row.sortOrder);
        setLayoutConfig(row.layoutConfig ?? { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG });
        setStatus(row.status);
        setSlugLocked(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken, isLoaded]);

  async function save(nextStatus: "DRAFT" | "PUBLISHED") {
    if (!canManageSiteContent) return;
    const payload: EkstrakurikulerFormValues = {
      name,
      slug,
      detail,
      fullDescription,
      kategori,
      previewUrl: previewUrl || "",
      relatedAchievements: linesToArray(achievements),
      jadwalRingkas,
      lokasiLatihan,
      pembinaNama,
      layoutConfig,
      sortOrder,
      status: nextStatus,
    };
    const parsed = ekstrakurikulerFormSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Validasi gagal");
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const saved =
        mode === "create"
          ? await createEkstrakurikuler(parsed.data, token)
          : await updateEkstrakurikuler(initial!.id, parsed.data, token);
      toast.success("Tersimpan");
      navigate(`/ekstrakurikuler/${saved.id}/edit`);
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyimpan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial || !canManageSiteContent) return;
    if (!window.confirm(`Hapus "${initial.name}"?`)) return;
    const token = await getToken();
    if (!token) return;
    await deleteEkstrakurikuler(initial.id, token);
    toast.success("Dihapus");
    navigate("/ekstrakurikuler");
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          {mode === "create" ? "Unit ekskul baru" : "Edit ekstrakurikuler"}
        </h1>
        <Button asChild size="sm" variant="secondary">
          <Link to="/ekstrakurikuler">Kembali</Link>
        </Button>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void save("DRAFT");
        }}
      >
        <div className="space-y-2">
          <Label>Nama</Label>
          <Input
            value={name}
            disabled={!canManageSiteContent}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugLocked) setSlug(slugifyJudul(e.target.value));
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              disabled={!canManageSiteContent || slugLocked}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <select
              className={selectClassName}
              value={kategori}
              disabled={!canManageSiteContent}
              onChange={(e) =>
                setKategori(e.target.value as typeof kategori)
              }
            >
              <option value="TEKNOLOGI">TEKNOLOGI</option>
              <option value="OLAHRAGA">OLAHRAGA</option>
              <option value="AKADEMIK">AKADEMIK</option>
              <option value="SENI">SENI</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Ringkasan kartu</Label>
          <textarea
            className={textareaClassName}
            value={detail}
            disabled={!canManageSiteContent}
            onChange={(e) => setDetail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Deskripsi lengkap</Label>
          <textarea
            className={textareaClassName}
            value={fullDescription}
            disabled={!canManageSiteContent}
            onChange={(e) => setFullDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <CoverImageDropzone
            value={previewUrl}
            onChange={setPreviewUrl}
            disabled={!canManageSiteContent}
          />
        </div>
        <div className="space-y-2">
          <Label>Prestasi terkait (satu baris per item)</Label>
          <textarea
            className={textareaClassName}
            value={achievements}
            disabled={!canManageSiteContent}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Jadwal</Label>
            <Input
              value={jadwalRingkas}
              disabled={!canManageSiteContent}
              onChange={(e) => setJadwalRingkas(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input
              value={lokasiLatihan}
              disabled={!canManageSiteContent}
              onChange={(e) => setLokasiLatihan(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pembina</Label>
            <Input
              value={pembinaNama}
              disabled={!canManageSiteContent}
              onChange={(e) => setPembinaNama(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Urutan</Label>
            <Input
              type="number"
              value={sortOrder}
              disabled={!canManageSiteContent}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className={selectClassName}
              value={status}
              disabled={!canManageSiteContent}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>
        <SiteContentLayoutConfigFields
          value={layoutConfig}
          onChange={setLayoutConfig}
          disabled={!canManageSiteContent}
        />
        {canManageSiteContent ? (
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy} variant="secondary">
              Simpan draft
            </Button>
            <Button
              type="button"
              disabled={busy}
              onClick={() => void save("PUBLISHED")}
            >
              Publikasikan
            </Button>
            {mode === "edit" && id ? (
              <SiteContentSubmitButton
                entity="ekstrakurikuler"
                id={id}
                status={status}
                disabled={busy}
                size="default"
                onDone={() => setStatus("PENDING_REVIEW")}
              />
            ) : null}
            {mode === "edit" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => void onDelete()}
              >
                Hapus
              </Button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}

/* ─── Prestasi ──────────────────────────────────────────────────── */

export function PrestasiListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<PrestasiListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchPrestasiListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Gagal memuat.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const unsubscribe = onRouterRefresh(() => void load());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [getToken, isLoaded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Prestasi
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Prestasi terverifikasi di halaman kesiswaan.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/prestasi/baru">Prestasi baru</Link>
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
              <tr>
                {canManageSiteContent ? <SortableHandleHeader /> : null}
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Siswa/Tim</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              <SortableContentRows
                entity="prestasi"
                items={items}
                setItems={setItems}
                getToken={getToken}
                enabled={canManageSiteContent && items.length > 0}
              >
                {(row, handle) => (
                  <>
                    {handle ? (
                      <td className="px-2 py-3 align-middle">{handle}</td>
                    ) : null}
                    <td className="px-4 py-3 font-medium">{row.judul}</td>
                    <td className="px-4 py-3">{row.siswaLabel}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/prestasi/${row.id}/edit`}>Edit</Link>
                        </Button>
                        {canManageSiteContent ? (
                          <SiteContentSubmitButton
                            entity="prestasi"
                            id={row.id}
                            status={row.status}
                            onDone={() =>
                              setItems((prev) =>
                                prev.map((x) =>
                                  x.id === row.id
                                    ? {
                                        ...x,
                                        status: "PENDING_REVIEW" as const,
                                        reviewNote: null,
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                        ) : null}
                      </div>
                    </td>
                  </>
                )}
              </SortableContentRows>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManageSiteContent ? 5 : 4}
                    className="px-4 py-8 text-center text-[color:var(--color-body)]"
                  >
                    Belum ada prestasi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PrestasiFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Prestasi | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [judul, setJudul] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [tanggalIso, setTanggalIso] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [siswaLabel, setSiswaLabel] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<
    "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED"
  >("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchPrestasiById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setJudul(row.judul);
        setPenyelenggara(row.penyelenggara);
        setTanggalIso(row.tanggalIso.slice(0, 10));
        setSiswaLabel(row.siswaLabel);
        setRingkasan(row.ringkasan);
        setFileUrl(row.fileUrl);
        setSortOrder(row.sortOrder);
        setLayoutConfig(row.layoutConfig ?? { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG });
        setStatus(row.status);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, id, getToken, isLoaded]);

  async function save(nextStatus: "DRAFT" | "PUBLISHED") {
    if (!canManageSiteContent) return;
    const payload: PrestasiFormValues = {
      judul,
      penyelenggara,
      tanggalIso: new Date(tanggalIso).toISOString(),
      siswaLabel,
      ringkasan,
      fileUrl,
      layoutConfig,
      sortOrder,
      status: nextStatus,
    };
    const parsed = prestasiFormSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Validasi gagal");
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const saved =
        mode === "create"
          ? await createPrestasi(parsed.data, token)
          : await updatePrestasi(initial!.id, parsed.data, token);
      toast.success("Tersimpan");
      navigate(`/prestasi/${saved.id}/edit`);
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyimpan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial || !canManageSiteContent) return;
    if (!window.confirm(`Hapus "${initial.judul}"?`)) return;
    const token = await getToken();
    if (!token) return;
    await deletePrestasi(initial.id, token);
    toast.success("Dihapus");
    navigate("/prestasi");
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          {mode === "create" ? "Prestasi baru" : "Edit prestasi"}
        </h1>
        <Button asChild size="sm" variant="secondary">
          <Link to="/prestasi">Kembali</Link>
        </Button>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void save("DRAFT");
        }}
      >
        <div className="space-y-2">
          <Label>Judul</Label>
          <Input
            value={judul}
            disabled={!canManageSiteContent}
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Penyelenggara</Label>
            <Input
              value={penyelenggara}
              disabled={!canManageSiteContent}
              onChange={(e) => setPenyelenggara(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={tanggalIso}
              disabled={!canManageSiteContent}
              onChange={(e) => setTanggalIso(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Siswa / tim</Label>
          <Input
            value={siswaLabel}
            disabled={!canManageSiteContent}
            onChange={(e) => setSiswaLabel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Ringkasan</Label>
          <textarea
            className={textareaClassName}
            value={ringkasan}
            disabled={!canManageSiteContent}
            onChange={(e) => setRingkasan(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Dokumentasi / gambar</Label>
          <CoverImageDropzone
            value={fileUrl}
            onChange={setFileUrl}
            disabled={!canManageSiteContent}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
              "application/pdf": [".pdf"],
            }}
            label="Seret gambar/PDF ke sini, atau klik untuk unggah"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Urutan</Label>
            <Input
              type="number"
              value={sortOrder}
              disabled={!canManageSiteContent}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className={selectClassName}
              value={status}
              disabled={!canManageSiteContent}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>
        <SiteContentLayoutConfigFields
          value={layoutConfig}
          onChange={setLayoutConfig}
          disabled={!canManageSiteContent}
        />
        {canManageSiteContent ? (
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy} variant="secondary">
              Simpan draft
            </Button>
            <Button
              type="button"
              disabled={busy}
              onClick={() => void save("PUBLISHED")}
            >
              Publikasikan
            </Button>
            {mode === "edit" && id ? (
              <SiteContentSubmitButton
                entity="prestasi"
                id={id}
                status={status}
                disabled={busy}
                size="default"
                onDone={() => setStatus("PENDING_REVIEW")}
              />
            ) : null}
            {mode === "edit" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => void onDelete()}
              >
                Hapus
              </Button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}

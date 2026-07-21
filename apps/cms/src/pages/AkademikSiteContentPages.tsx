"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { CoverImageDropzone } from "@/components/dashboard/media/CoverImageDropzone";
import { SortableContentRows, SortableHandleHeader } from "@/components/dashboard/site-content/SortableContentRows";
import { FormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createKurikulum,
  createProgramJurusan,
  createProgramSekolah,
  createTenagaPengajar,
  deleteKurikulum,
  deleteProgramJurusan,
  deleteProgramSekolah,
  deleteTenagaPengajar,
  fetchKurikulumById,
  fetchKurikulumListCms,
  fetchProgramJurusanById,
  fetchProgramJurusanListCms,
  fetchProgramSekolahById,
  fetchProgramSekolahListCms,
  fetchTenagaPengajarById,
  fetchTenagaPengajarListCms,
  kurikulumFormSchema,
  programJurusanFormSchema,
  programSekolahFormSchema,
  slugifyJudul,
  tenagaPengajarFormSchema,
  updateKurikulum,
  updateProgramJurusan,
  updateProgramSekolah,
  updateTenagaPengajar,
  type Kurikulum,
  type KurikulumFormValues,
  type KurikulumListItem,
  type ProgramJurusan,
  type ProgramJurusanFormValues,
  type ProgramJurusanListItem,
  type ProgramSekolah,
  type ProgramSekolahFormValues,
  type ProgramSekolahListItem,
  type TenagaPengajar,
  type TenagaPengajarFormValues,
  type TenagaPengajarListItem,
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

type SiteStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[] | undefined): string {
  return (value ?? []).join("\n");
}

function mediaSosialToLines(
  value: Record<string, string> | null | undefined,
): string {
  if (!value) return "";
  return Object.entries(value)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
}

function linesToMediaSosial(
  value: string,
): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const line of linesToArray(value)) {
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key) out[key] = val;
  }
  return Object.keys(out).length ? out : null;
}

function strukturToText(value: unknown | null | undefined): string {
  if (value == null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function parseStrukturJson(value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as unknown;
}

function StatusSelect({
  id,
  value,
  disabled,
  onChange,
}: {
  id: string;
  value: SiteStatus;
  disabled?: boolean;
  onChange: (v: SiteStatus) => void;
}) {
  return (
    <select
      id={id}
      className={selectClassName}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as SiteStatus)}
    >
      <option value="DRAFT">DRAFT</option>
      <option value="PENDING_REVIEW">PENDING_REVIEW</option>
      <option value="PUBLISHED">PUBLISHED</option>
      <option value="REJECTED">REJECTED</option>
      <option value="ARCHIVED">ARCHIVED</option>
    </select>
  );
}

function FormActions({
  busy,
  mode,
  onDelete,
  onPublish,
  entity,
  id,
  status,
  onSubmitted,
  reviewNote,
}: {
  busy: boolean;
  mode: "create" | "edit";
  onDelete?: () => void;
  onPublish: () => void;
  entity?:
    | "kurikulum"
    | "program-sekolah"
    | "program-jurusan"
    | "tenaga-pengajar";
  id?: string;
  status?: SiteStatus;
  onSubmitted?: () => void;
  reviewNote?: string | null;
}) {
  return (
    <div className="space-y-3 pt-2">
      {mode === "edit" && status ? (
        <SiteContentReviewNoteBanner status={status} reviewNote={reviewNote} />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy} variant="secondary">
          Simpan draft
        </Button>
        <Button type="button" disabled={busy} onClick={onPublish}>
          Publikasikan
        </Button>
        {mode === "edit" && entity && id && status ? (
          <SiteContentSubmitButton
            entity={entity}
            id={id}
            status={status}
            disabled={busy}
            size="default"
            onDone={onSubmitted}
          />
        ) : null}
        {mode === "edit" && onDelete ? (
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onDelete}
          >
            Hapus
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Kurikulum ─────────────────────────────────────────────────── */

export function KurikulumListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<KurikulumListItem[]>([]);
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
        const res = await fetchKurikulumListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat kurikulum.",
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
            Kurikulum
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Kelola dokumen dan struktur kurikulum yang tampil di situs publik.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/kurikulum/baru">Kurikulum baru</Link>
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
                <th className="px-4 py-3 font-medium">Tahun ajaran</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
                            <SortableContentRows
                entity="kurikulum"
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
                      {row.judul}
                    </div>
                    <div className="text-xs text-[color:var(--color-body)]">
                      /kurikulum/{row.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.tahunAjaran}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/kurikulum/${row.id}/edit`}>Edit</Link>
                      </Button>
                      {canManageSiteContent ? (
                        <SiteContentSubmitButton
                          entity="kurikulum"
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
                    Belum ada kurikulum.
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

export function KurikulumFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Kurikulum | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [deskripsi, setDeskripsi] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [dokumenUrl, setDokumenUrl] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [strukturKurikulum, setStrukturKurikulum] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<SiteStatus>("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchKurikulumById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setJudul(row.judul);
        setSlug(row.slug);
        setSlugLocked(true);
        setDeskripsi(row.deskripsi);
        setCoverUrl(row.coverUrl ?? "");
        setDokumenUrl(row.dokumenUrl ?? "");
        setTahunAjaran(row.tahunAjaran);
        setJurusan(arrayToLines(row.jurusan));
        setStrukturKurikulum(strukturToText(row.strukturKurikulum));
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
      toast.error("Peran Anda tidak dapat menyimpan kurikulum.");
      return;
    }
    let struktur: unknown | null = null;
    try {
      struktur = parseStrukturJson(strukturKurikulum);
    } catch {
      toast.error("Struktur kurikulum harus JSON valid atau kosong.");
      return;
    }
    const payload: KurikulumFormValues = {
      judul,
      slug,
      deskripsi,
      coverUrl: coverUrl || "",
      dokumenUrl: dokumenUrl || "",
      tahunAjaran,
      jurusan: linesToArray(jurusan),
      strukturKurikulum: struktur,
      sortOrder,
      layoutConfig,
      showInNav,
      status: nextStatus,
    };
    const parsed = kurikulumFormSchema.safeParse(payload);
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
          ? await createKurikulum(parsed.data, token)
          : await updateKurikulum(initial!.id, parsed.data, token);
      toast.success(
        saved.status === "PUBLISHED"
          ? "Kurikulum dipublikasikan"
          : "Draft disimpan",
      );
      navigate(`/kurikulum/${saved.id}/edit`);
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
    if (!window.confirm(`Hapus kurikulum "${initial.judul}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteKurikulum(initial.id, token);
      toast.success("Kurikulum dihapus");
      navigate("/kurikulum");
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
            {mode === "create" ? "Kurikulum baru" : "Edit kurikulum"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Dokumen PDF dan struktur kurikulum (JSON opsional).
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/kurikulum">Kembali</Link>
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
            <Label htmlFor="k-judul">Judul</Label>
            <Input
              id="k-judul"
              value={judul}
              disabled={!canManageSiteContent}
              onChange={(e) => {
                setJudul(e.target.value);
                if (!slugLocked) setSlug(slugifyJudul(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="k-slug">Slug</Label>
              <Input
                id="k-slug"
                value={slug}
                disabled={!canManageSiteContent || slugLocked}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-tahun">Tahun ajaran</Label>
              <Input
                id="k-tahun"
                value={tahunAjaran}
                disabled={!canManageSiteContent}
                onChange={(e) => setTahunAjaran(e.target.value)}
                placeholder="2025/2026"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-desc">Deskripsi</Label>
            <textarea
              id="k-desc"
              className={textareaClassName}
              value={deskripsi}
              disabled={!canManageSiteContent}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cover</Label>
              <CoverImageDropzone
                value={coverUrl}
                onChange={setCoverUrl}
                disabled={!canManageSiteContent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-dok">Dokumen URL</Label>
              <Input
                id="k-dok"
                value={dokumenUrl}
                disabled={!canManageSiteContent}
                onChange={(e) => setDokumenUrl(e.target.value)}
                placeholder="https://…/kurikulum.pdf"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-jurusan">Jurusan (satu baris per item)</Label>
            <textarea
              id="k-jurusan"
              className={textareaClassName}
              value={jurusan}
              disabled={!canManageSiteContent}
              onChange={(e) => setJurusan(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-struktur">Struktur kurikulum (JSON opsional)</Label>
            <textarea
              id="k-struktur"
              className={`${textareaClassName} font-mono text-xs`}
              value={strukturKurikulum}
              disabled={!canManageSiteContent}
              onChange={(e) => setStrukturKurikulum(e.target.value)}
              placeholder='[{"mapel":"…"}]'
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="k-order">Urutan</Label>
              <Input
                id="k-order"
                type="number"
                value={sortOrder}
                disabled={!canManageSiteContent}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-status">Status</Label>
              <StatusSelect
                id="k-status"
                value={status}
                disabled={!canManageSiteContent}
                onChange={setStatus}
              />
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
          {canManageSiteContent ? (
            <FormActions
              busy={busy}
              mode={mode}
              entity="kurikulum"
              id={id}
              status={status}
              reviewNote={initial?.reviewNote}
              onSubmitted={() => setStatus("PENDING_REVIEW")}
              onDelete={() => void onDelete()}
              onPublish={() => void save("PUBLISHED")}
            />
          ) : null}
        </form>
      )}
    </div>
  );
}

/* ─── Program sekolah ───────────────────────────────────────────── */

export function ProgramSekolahListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<ProgramSekolahListItem[]>([]);
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
        const res = await fetchProgramSekolahListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat program sekolah.",
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
            Program sekolah
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Program unggulan, tahfidz, dan program non-akademik sekolah.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/program-sekolah/baru">Program baru</Link>
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
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
                            <SortableContentRows
                entity="program-sekolah"
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
                      {row.judul}
                    </div>
                    <div className="text-xs text-[color:var(--color-body)]">
                      /program-sekolah/{row.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.kategori}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/program-sekolah/${row.id}/edit`}>Edit</Link>
                      </Button>
                      {canManageSiteContent ? (
                        <SiteContentSubmitButton
                          entity="program-sekolah"
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
                    Belum ada program sekolah.
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

export function ProgramSekolahFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<ProgramSekolah | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [deskripsi, setDeskripsi] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [ikon, setIkon] = useState("");
  const [kategori, setKategori] = useState<
    "AKADEMIK" | "NON_AKADEMIK" | "KEAGAMAAN"
  >("AKADEMIK");
  const [highlightItems, setHighlightItems] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<SiteStatus>("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchProgramSekolahById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setJudul(row.judul);
        setSlug(row.slug);
        setSlugLocked(true);
        setDeskripsi(row.deskripsi);
        setCoverUrl(row.coverUrl ?? "");
        setIkon(row.ikon ?? "");
        setKategori(row.kategori);
        setHighlightItems(arrayToLines(row.highlightItems));
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
      toast.error("Peran Anda tidak dapat menyimpan program sekolah.");
      return;
    }
    const payload: ProgramSekolahFormValues = {
      judul,
      slug,
      deskripsi,
      coverUrl: coverUrl || "",
      ikon: ikon || "",
      kategori,
      highlightItems: linesToArray(highlightItems),
      sortOrder,
      layoutConfig,
      showInNav,
      status: nextStatus,
    };
    const parsed = programSekolahFormSchema.safeParse(payload);
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
          ? await createProgramSekolah(parsed.data, token)
          : await updateProgramSekolah(initial!.id, parsed.data, token);
      toast.success(
        saved.status === "PUBLISHED"
          ? "Program dipublikasikan"
          : "Draft disimpan",
      );
      navigate(`/program-sekolah/${saved.id}/edit`);
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
    if (!window.confirm(`Hapus program "${initial.judul}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteProgramSekolah(initial.id, token);
      toast.success("Program sekolah dihapus");
      navigate("/program-sekolah");
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
            {mode === "create" ? "Program sekolah baru" : "Edit program sekolah"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Highlight dan kategori tampil di halaman program.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/program-sekolah">Kembali</Link>
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
            <Label htmlFor="ps-judul">Judul</Label>
            <Input
              id="ps-judul"
              value={judul}
              disabled={!canManageSiteContent}
              onChange={(e) => {
                setJudul(e.target.value);
                if (!slugLocked) setSlug(slugifyJudul(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ps-slug">Slug</Label>
              <Input
                id="ps-slug"
                value={slug}
                disabled={!canManageSiteContent || slugLocked}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ps-kat">Kategori</Label>
              <select
                id="ps-kat"
                className={selectClassName}
                value={kategori}
                disabled={!canManageSiteContent}
                onChange={(e) =>
                  setKategori(e.target.value as typeof kategori)
                }
              >
                <option value="AKADEMIK">AKADEMIK</option>
                <option value="NON_AKADEMIK">NON_AKADEMIK</option>
                <option value="KEAGAMAAN">KEAGAMAAN</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-desc">Deskripsi</Label>
            <textarea
              id="ps-desc"
              className={textareaClassName}
              value={deskripsi}
              disabled={!canManageSiteContent}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cover</Label>
              <CoverImageDropzone
                value={coverUrl}
                onChange={setCoverUrl}
                disabled={!canManageSiteContent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ps-ikon">Ikon</Label>
              <Input
                id="ps-ikon"
                value={ikon}
                disabled={!canManageSiteContent}
                onChange={(e) => setIkon(e.target.value)}
                placeholder="class name atau URL SVG"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps-hl">Highlight (satu baris per item)</Label>
            <textarea
              id="ps-hl"
              className={textareaClassName}
              value={highlightItems}
              disabled={!canManageSiteContent}
              onChange={(e) => setHighlightItems(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ps-order">Urutan</Label>
              <Input
                id="ps-order"
                type="number"
                value={sortOrder}
                disabled={!canManageSiteContent}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ps-status">Status</Label>
              <StatusSelect
                id="ps-status"
                value={status}
                disabled={!canManageSiteContent}
                onChange={setStatus}
              />
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
          {canManageSiteContent ? (
            <FormActions
              busy={busy}
              mode={mode}
              entity="program-sekolah"
              id={id}
              status={status}
              reviewNote={initial?.reviewNote}
              onSubmitted={() => setStatus("PENDING_REVIEW")}
              onDelete={() => void onDelete()}
              onPublish={() => void save("PUBLISHED")}
            />
          ) : null}
        </form>
      )}
    </div>
  );
}

/* ─── Program jurusan ───────────────────────────────────────────── */

export function ProgramJurusanListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<ProgramJurusanListItem[]>([]);
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
        const res = await fetchProgramJurusanListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat program jurusan.",
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
            Program jurusan
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Profil jurusan, kompetensi, dan prospek kerja lulusan.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/program-jurusan/baru">Jurusan baru</Link>
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
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Singkatan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
                            <SortableContentRows
                entity="program-jurusan"
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
                      {row.nama}
                    </div>
                    <div className="text-xs text-[color:var(--color-body)]">
                      /program-jurusan/{row.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.singkatan}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/program-jurusan/${row.id}/edit`}>Edit</Link>
                      </Button>
                      {canManageSiteContent ? (
                        <SiteContentSubmitButton
                          entity="program-jurusan"
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
                    Belum ada program jurusan.
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

export function ProgramJurusanFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<ProgramJurusan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [singkatan, setSingkatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [ikon, setIkon] = useState("");
  const [prospekKerja, setProspekKerja] = useState("");
  const [kompetensiDasar, setKompetensiDasar] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [jumlahSiswa, setJumlahSiswa] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<SiteStatus>("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchProgramJurusanById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setNama(row.nama);
        setSlug(row.slug);
        setSlugLocked(true);
        setSingkatan(row.singkatan);
        setDeskripsi(row.deskripsi);
        setCoverUrl(row.coverUrl ?? "");
        setIkon(row.ikon ?? "");
        setProspekKerja(arrayToLines(row.prospekKerja));
        setKompetensiDasar(arrayToLines(row.kompetensiDasar));
        setFasilitas(arrayToLines(row.fasilitas));
        setJumlahSiswa(
          row.jumlahSiswa == null ? "" : String(row.jumlahSiswa),
        );
        setLinkPendaftaran(row.linkPendaftaran ?? "");
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
      toast.error("Peran Anda tidak dapat menyimpan program jurusan.");
      return;
    }
    const jumlah =
      jumlahSiswa.trim() === "" ? null : Number(jumlahSiswa);
    if (jumlah != null && Number.isNaN(jumlah)) {
      toast.error("Jumlah siswa harus angka.");
      return;
    }
    const payload: ProgramJurusanFormValues = {
      nama,
      slug,
      singkatan,
      deskripsi,
      coverUrl: coverUrl || "",
      ikon: ikon || "",
      prospekKerja: linesToArray(prospekKerja),
      kompetensiDasar: linesToArray(kompetensiDasar),
      fasilitas: linesToArray(fasilitas),
      jumlahSiswa: jumlah,
      linkPendaftaran: linkPendaftaran || "",
      sortOrder,
      layoutConfig,
      showInNav,
      status: nextStatus,
    };
    const parsed = programJurusanFormSchema.safeParse(payload);
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
          ? await createProgramJurusan(parsed.data, token)
          : await updateProgramJurusan(initial!.id, parsed.data, token);
      toast.success(
        saved.status === "PUBLISHED"
          ? "Jurusan dipublikasikan"
          : "Draft disimpan",
      );
      navigate(`/program-jurusan/${saved.id}/edit`);
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
    if (!window.confirm(`Hapus jurusan "${initial.nama}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteProgramJurusan(initial.id, token);
      toast.success("Program jurusan dihapus");
      navigate("/program-jurusan");
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
            {mode === "create" ? "Jurusan baru" : "Edit program jurusan"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Kompetensi, fasilitas, dan prospek kerja per jurusan.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/program-jurusan">Kembali</Link>
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
            <Label htmlFor="pj-nama">Nama</Label>
            <Input
              id="pj-nama"
              value={nama}
              disabled={!canManageSiteContent}
              onChange={(e) => {
                setNama(e.target.value);
                if (!slugLocked) setSlug(slugifyJudul(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pj-slug">Slug</Label>
              <Input
                id="pj-slug"
                value={slug}
                disabled={!canManageSiteContent || slugLocked}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pj-singkatan">Singkatan</Label>
              <Input
                id="pj-singkatan"
                value={singkatan}
                disabled={!canManageSiteContent}
                onChange={(e) => setSingkatan(e.target.value)}
                placeholder="TKJ"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pj-desc">Deskripsi</Label>
            <textarea
              id="pj-desc"
              className={textareaClassName}
              value={deskripsi}
              disabled={!canManageSiteContent}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cover</Label>
              <CoverImageDropzone
                value={coverUrl}
                onChange={setCoverUrl}
                disabled={!canManageSiteContent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pj-ikon">Ikon</Label>
              <Input
                id="pj-ikon"
                value={ikon}
                disabled={!canManageSiteContent}
                onChange={(e) => setIkon(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pj-prospek">Prospek kerja (satu baris per item)</Label>
            <textarea
              id="pj-prospek"
              className={textareaClassName}
              value={prospekKerja}
              disabled={!canManageSiteContent}
              onChange={(e) => setProspekKerja(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pj-komp">Kompetensi dasar (satu baris per item)</Label>
            <textarea
              id="pj-komp"
              className={textareaClassName}
              value={kompetensiDasar}
              disabled={!canManageSiteContent}
              onChange={(e) => setKompetensiDasar(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pj-fas">Fasilitas (satu baris per item)</Label>
            <textarea
              id="pj-fas"
              className={textareaClassName}
              value={fasilitas}
              disabled={!canManageSiteContent}
              onChange={(e) => setFasilitas(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pj-siswa">Jumlah siswa</Label>
              <Input
                id="pj-siswa"
                type="number"
                value={jumlahSiswa}
                disabled={!canManageSiteContent}
                onChange={(e) => setJumlahSiswa(e.target.value)}
                placeholder="opsional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pj-link">Link pendaftaran</Label>
              <Input
                id="pj-link"
                value={linkPendaftaran}
                disabled={!canManageSiteContent}
                onChange={(e) => setLinkPendaftaran(e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="pj-order">Urutan</Label>
              <Input
                id="pj-order"
                type="number"
                value={sortOrder}
                disabled={!canManageSiteContent}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pj-status">Status</Label>
              <StatusSelect
                id="pj-status"
                value={status}
                disabled={!canManageSiteContent}
                onChange={setStatus}
              />
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
          {canManageSiteContent ? (
            <FormActions
              busy={busy}
              mode={mode}
              entity="program-jurusan"
              id={id}
              status={status}
              reviewNote={initial?.reviewNote}
              onSubmitted={() => setStatus("PENDING_REVIEW")}
              onDelete={() => void onDelete()}
              onPublish={() => void save("PUBLISHED")}
            />
          ) : null}
        </form>
      )}
    </div>
  );
}

/* ─── Tenaga pengajar ───────────────────────────────────────────── */

export function TenagaPengajarListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<TenagaPengajarListItem[]>([]);
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
        const res = await fetchTenagaPengajarListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat tenaga pengajar.",
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
            Tenaga pengajar
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Profil guru dan staf yang tampil di situs publik.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/tenaga-pengajar/baru">Pengajar baru</Link>
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
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
                            <SortableContentRows
                entity="tenaga-pengajar"
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
                      {row.nama}
                    </div>
                    <div className="text-xs text-[color:var(--color-body)]">
                      /tenaga-pengajar/{row.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.jabatan}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link to={`/tenaga-pengajar/${row.id}/edit`}>Edit</Link>
                      </Button>
                      {canManageSiteContent ? (
                        <SiteContentSubmitButton
                          entity="tenaga-pengajar"
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
                    Belum ada tenaga pengajar.
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

export function TenagaPengajarFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<TenagaPengajar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [nip, setNip] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [bidangKeahlian, setBidangKeahlian] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [kontakEmail, setKontakEmail] = useState("");
  const [mediaSosial, setMediaSosial] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<SiteStatus>("DRAFT");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchTenagaPengajarById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setNama(row.nama);
        setSlug(row.slug);
        setSlugLocked(true);
        setNip(row.nip ?? "");
        setFotoUrl(row.fotoUrl ?? "");
        setJabatan(row.jabatan);
        setBidangKeahlian(row.bidangKeahlian ?? "");
        setMataPelajaran(arrayToLines(row.mataPelajaran));
        setPendidikan(row.pendidikan ?? "");
        setPengalaman(row.pengalaman ?? "");
        setKontakEmail(row.kontakEmail ?? "");
        setMediaSosial(mediaSosialToLines(row.mediaSosial));
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
      toast.error("Peran Anda tidak dapat menyimpan tenaga pengajar.");
      return;
    }
    const payload: TenagaPengajarFormValues = {
      nama,
      slug,
      nip: nip || "",
      fotoUrl: fotoUrl || "",
      jabatan,
      bidangKeahlian: bidangKeahlian || "",
      mataPelajaran: linesToArray(mataPelajaran),
      pendidikan: pendidikan || "",
      pengalaman: pengalaman || "",
      kontakEmail: kontakEmail || "",
      mediaSosial: linesToMediaSosial(mediaSosial),
      sortOrder,
      layoutConfig,
      showInNav,
      status: nextStatus,
    };
    const parsed = tenagaPengajarFormSchema.safeParse(payload);
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
          ? await createTenagaPengajar(parsed.data, token)
          : await updateTenagaPengajar(initial!.id, parsed.data, token);
      toast.success(
        saved.status === "PUBLISHED"
          ? "Pengajar dipublikasikan"
          : "Draft disimpan",
      );
      navigate(`/tenaga-pengajar/${saved.id}/edit`);
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
    if (!window.confirm(`Hapus pengajar "${initial.nama}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteTenagaPengajar(initial.id, token);
      toast.success("Tenaga pengajar dihapus");
      navigate("/tenaga-pengajar");
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
            {mode === "create" ? "Pengajar baru" : "Edit tenaga pengajar"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Foto, jabatan, dan mata pelajaran tampil di halaman guru.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/tenaga-pengajar">Kembali</Link>
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
            <Label htmlFor="tp-nama">Nama</Label>
            <Input
              id="tp-nama"
              value={nama}
              disabled={!canManageSiteContent}
              onChange={(e) => {
                setNama(e.target.value);
                if (!slugLocked) setSlug(slugifyJudul(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tp-slug">Slug</Label>
              <Input
                id="tp-slug"
                value={slug}
                disabled={!canManageSiteContent || slugLocked}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-nip">NIP / NUPTK</Label>
              <Input
                id="tp-nip"
                value={nip}
                disabled={!canManageSiteContent}
                onChange={(e) => setNip(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tp-jabatan">Jabatan</Label>
              <Input
                id="tp-jabatan"
                value={jabatan}
                disabled={!canManageSiteContent}
                onChange={(e) => setJabatan(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-bidang">Bidang keahlian</Label>
              <Input
                id="tp-bidang"
                value={bidangKeahlian}
                disabled={!canManageSiteContent}
                onChange={(e) => setBidangKeahlian(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Foto</Label>
            <CoverImageDropzone
              value={fotoUrl}
              onChange={setFotoUrl}
              disabled={!canManageSiteContent}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp-mapel">Mata pelajaran (satu baris per item)</Label>
            <textarea
              id="tp-mapel"
              className={textareaClassName}
              value={mataPelajaran}
              disabled={!canManageSiteContent}
              onChange={(e) => setMataPelajaran(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tp-pendidikan">Pendidikan</Label>
              <Input
                id="tp-pendidikan"
                value={pendidikan}
                disabled={!canManageSiteContent}
                onChange={(e) => setPendidikan(e.target.value)}
                placeholder="S2 Pendidikan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-email">Email</Label>
              <Input
                id="tp-email"
                type="email"
                value={kontakEmail}
                disabled={!canManageSiteContent}
                onChange={(e) => setKontakEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp-pengalaman">Pengalaman</Label>
            <textarea
              id="tp-pengalaman"
              className={textareaClassName}
              value={pengalaman}
              disabled={!canManageSiteContent}
              onChange={(e) => setPengalaman(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp-sosial">
              Media sosial (satu baris: platform=url)
            </Label>
            <textarea
              id="tp-sosial"
              className={textareaClassName}
              value={mediaSosial}
              disabled={!canManageSiteContent}
              onChange={(e) => setMediaSosial(e.target.value)}
              placeholder={"instagram=https://…\nlinkedin=https://…"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tp-order">Urutan</Label>
              <Input
                id="tp-order"
                type="number"
                value={sortOrder}
                disabled={!canManageSiteContent}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-status">Status</Label>
              <StatusSelect
                id="tp-status"
                value={status}
                disabled={!canManageSiteContent}
                onChange={setStatus}
              />
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
          {canManageSiteContent ? (
            <FormActions
              busy={busy}
              mode={mode}
              entity="tenaga-pengajar"
              id={id}
              status={status}
              reviewNote={initial?.reviewNote}
              onSubmitted={() => setStatus("PENDING_REVIEW")}
              onDelete={() => void onDelete()}
              onPublish={() => void save("PUBLISHED")}
            />
          ) : null}
        </form>
      )}
    </div>
  );
}

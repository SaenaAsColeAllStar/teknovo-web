"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { EmptyState } from "@/components/ui/empty-state";
import { FormSection } from "@/components/ui/form-section";
import { CoverImageDropzone } from "@/components/dashboard/media/CoverImageDropzone";
import { SortableContentRows, SortableHandleHeader } from "@/components/dashboard/site-content/SortableContentRows";
import { FormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createPengumuman,
  deletePengumuman,
  fetchPengumumanById,
  fetchPengumumanListCms,
  pengumumanFormSchema,
  slugifyJudul,
  updatePengumuman,
  type Pengumuman,
  type PengumumanFormValues,
  type PengumumanListItem,
} from "@/lib/api-client";

import {
  SiteContentReviewNoteBanner,
  SiteContentSubmitButton,
} from "../components/dashboard/moderasi/SiteContentSubmitButton";
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
  "min-h-[160px] w-full rounded-none border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-brand)]/20";

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function PengumumanListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<PengumumanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const res = await fetchPengumumanListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat pengumuman.",
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
            Pengumuman
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Banner info, peringatan, dan pengumuman sticky dengan jadwal mulai–akhir.
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/pengumuman/baru">Pengumuman baru</Link>
          </Button>
        ) : null}
      </div>
      {error ? (
        <EmptyState
          icon={Megaphone}
          title="Tidak dapat memuat"
          description={error}
        />
      ) : null}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Belum ada pengumuman"
          description="Buat pengumuman resmi dengan tipe info, peringatan, atau urgent."
          action={
            canManageSiteContent ? (
              <Button asChild size="sm">
                <Link to="/pengumuman/baru">Buat pengumuman</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto border border-[color:var(--color-border)] bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)]">
              <tr>
                {canManageSiteContent ? <SortableHandleHeader /> : null}
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">Sticky</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              <SortableContentRows
                entity="pengumuman"
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
                        /{row.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.tipe}</td>
                    <td className="px-4 py-3">{row.isSticky ? "Ya" : "—"}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/pengumuman/${row.id}/edit`}>Edit</Link>
                        </Button>
                        {canManageSiteContent ? (
                          <SiteContentSubmitButton
                            entity="pengumuman"
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PengumumanFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Pengumuman | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [konten, setKonten] = useState("");
  const [tipe, setTipe] = useState<"INFO" | "WARNING" | "URGENT">("INFO");
  const [bannerUrl, setBannerUrl] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<
    "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED"
  >("DRAFT");
  const [reviewNote, setReviewNote] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchPengumumanById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setJudul(row.judul);
        setSlug(row.slug);
        setKonten(row.konten);
        setTipe(row.tipe);
        setBannerUrl(row.bannerUrl ?? "");
        setTanggalMulai(toDateInput(row.tanggalMulai));
        setTanggalAkhir(toDateInput(row.tanggalAkhir));
        setIsSticky(row.isSticky);
        setSortOrder(row.sortOrder);
        setLayoutConfig(row.layoutConfig ?? { ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG });
        setStatus(row.status);
        setReviewNote(row.reviewNote);
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
    const payload: PengumumanFormValues = {
      judul,
      slug,
      konten,
      tipe,
      bannerUrl,
      tanggalMulai: tanggalMulai
        ? new Date(`${tanggalMulai}T00:00:00.000Z`).toISOString()
        : null,
      tanggalAkhir: tanggalAkhir
        ? new Date(`${tanggalAkhir}T23:59:59.000Z`).toISOString()
        : null,
      isSticky,
      layoutConfig,
      sortOrder,
      status: nextStatus,
    };
    const parsed = pengumumanFormSchema.safeParse(payload);
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
          ? await createPengumuman(parsed.data, token)
          : await updatePengumuman(initial!.id, parsed.data, token);
      toast.success("Tersimpan");
      navigate(`/pengumuman/${saved.id}/edit`);
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
    await deletePengumuman(initial.id, token);
    toast.success("Dihapus");
    navigate("/pengumuman");
  }

  if (loading) return <FormSkeleton />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          {mode === "create" ? "Pengumuman baru" : "Edit pengumuman"}
        </h1>
        <Button asChild size="sm" variant="secondary">
          <Link to="/pengumuman">Kembali</Link>
        </Button>
      </div>

      <SiteContentReviewNoteBanner status={status} reviewNote={reviewNote} />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void save("DRAFT");
        }}
      >
        <FormSection
          title="Informasi dasar"
          description="Judul, slug, tipe, dan jadwal tampil"
        >
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input
              value={judul}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => {
                const v = e.target.value;
                setJudul(v);
                if (!slugLocked) setSlug(slugifyJudul(v));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => {
                setSlugLocked(true);
                setSlug(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipe</Label>
              <select
                className={selectClassName}
                value={tipe}
                disabled={!canManageSiteContent || busy}
                onChange={(e) =>
                  setTipe(e.target.value as "INFO" | "WARNING" | "URGENT")
                }
              >
                <option value="INFO">Info</option>
                <option value="WARNING">Peringatan</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                min={0}
                value={sortOrder}
                disabled={!canManageSiteContent || busy}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tanggal mulai</Label>
              <Input
                type="date"
                value={tanggalMulai}
                disabled={!canManageSiteContent || busy}
                onChange={(e) => setTanggalMulai(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal akhir</Label>
              <Input
                type="date"
                value={tanggalAkhir}
                disabled={!canManageSiteContent || busy}
                onChange={(e) => setTanggalAkhir(e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-heading)]">
            <input
              type="checkbox"
              checked={isSticky}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setIsSticky(e.target.checked)}
            />
            Sticky (tampil di atas daftar)
          </label>
        </FormSection>

        <FormSection title="Konten" description="Isi pengumuman dan banner opsional">
          <div className="space-y-2">
            <Label>Banner</Label>
            <CoverImageDropzone
              value={bannerUrl}
              onChange={setBannerUrl}
              disabled={!canManageSiteContent || busy}
            />
          </div>
          <div className="space-y-2">
            <Label>Konten</Label>
            <textarea
              className={textareaClassName}
              value={konten}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setKonten(e.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="Layout" description="Konfigurasi tampilan halaman">
          <SiteContentLayoutConfigFields
            value={layoutConfig}
            disabled={!canManageSiteContent || busy}
            onChange={setLayoutConfig}
          />
        </FormSection>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={!canManageSiteContent || busy}>
            Simpan draf
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!canManageSiteContent || busy}
            onClick={() => void save("PUBLISHED")}
          >
            Publikasikan
          </Button>
          {mode === "edit" && initial ? (
            <Button
              type="button"
              variant="secondary"
              disabled={!canManageSiteContent || busy}
              onClick={() => void onDelete()}
            >
              Hapus
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

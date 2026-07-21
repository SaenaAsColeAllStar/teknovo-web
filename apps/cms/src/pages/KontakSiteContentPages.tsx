"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { SortableContentRows, SortableHandleHeader } from "@/components/dashboard/site-content/SortableContentRows";
import { FormSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  createKontak,
  deleteKontak,
  fetchKontakById,
  fetchKontakListCms,
  kontakFormSchema,
  slugifyJudul,
  updateKontak,
  type Kontak,
  type KontakFormValues,
  type KontakListItem,
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

function linesToMediaSosial(value: string): Record<string, string> | null {
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

function jamToText(
  value: { hari: string; buka: string; tutup: string }[] | null | undefined,
): string {
  if (!value?.length) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function parseJamJson(
  value: string,
): { hari: string; buka: string; tutup: string }[] | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Jam operasional harus array JSON");
  }
  return parsed as { hari: string; buka: string; tutup: string }[];
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
  id,
  status,
  onSubmitted,
  reviewNote,
}: {
  busy: boolean;
  mode: "create" | "edit";
  onDelete?: () => void;
  onPublish: () => void;
  id?: string;
  status?: SiteStatus;
  onSubmitted?: () => void;
  reviewNote?: string | null;
}) {
  return (
    <div className="space-y-3 border-t border-[color:var(--color-border)] pt-4">
      {mode === "edit" && status ? (
        <SiteContentReviewNoteBanner status={status} reviewNote={reviewNote} />
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy} variant="secondary">
          {busy ? "Menyimpan…" : "Simpan draft"}
        </Button>
        <Button type="button" disabled={busy} onClick={onPublish}>
          Terbitkan
        </Button>
        {mode === "edit" && id && status ? (
          <SiteContentSubmitButton
            entity="kontak"
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
            disabled={busy}
            variant="secondary"
            className="text-red-700"
            onClick={onDelete}
          >
            Hapus
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function KontakListPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [items, setItems] = useState<KontakListItem[]>([]);
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
        const res = await fetchKontakListCms(token, { limit: 100 });
        if (!cancelled) setItems(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat kontak.",
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
            Kontak
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Alamat, telepon, email, dan lokasi sekolah (multi-kampus).
          </p>
        </div>
        {canManageSiteContent ? (
          <Button asChild size="sm">
            <Link to="/kontak/baru">Kontak baru</Link>
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
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              <SortableContentRows
                entity="kontak"
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
                        {row.label}
                      </div>
                      <div className="text-xs text-[color:var(--color-body)]">
                        /kontak/{row.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.whatsapp ?? "—"}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 tabular-nums">{row.sortOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link to={`/kontak/${row.id}/edit`}>Edit</Link>
                        </Button>
                        {canManageSiteContent ? (
                          <SiteContentSubmitButton
                            entity="kontak"
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
                    Belum ada kontak.
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

export function KontakFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteContent } = useCmsRole();
  const [initial, setInitial] = useState<Kontak | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState("");
  const [jamOperasional, setJamOperasional] = useState("");
  const [mediaSosial, setMediaSosial] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState<SiteContentLayoutConfig>({
    ...DEFAULT_SITE_CONTENT_LAYOUT_CONFIG,
  });
  const [status, setStatus] = useState<SiteStatus>("PUBLISHED");

  useEffect(() => {
    if (!isLoaded || mode !== "edit" || !id) return;
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const row = await fetchKontakById(id!, token);
        if (cancelled) return;
        setInitial(row);
        setLabel(row.label);
        setSlug(row.slug);
        setSlugLocked(true);
        setAlamatLengkap(row.alamatLengkap);
        setTelepon(arrayToLines(row.telepon));
        setEmail(arrayToLines(row.email));
        setWhatsapp(row.whatsapp ?? "");
        setGoogleMapsUrl(row.googleMapsUrl ?? "");
        setGoogleMapsEmbed(row.googleMapsEmbed ?? "");
        setJamOperasional(jamToText(row.jamOperasional));
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
      toast.error("Peran Anda tidak dapat menyimpan kontak.");
      return;
    }
    let jamParsed: KontakFormValues["jamOperasional"] = null;
    try {
      jamParsed = parseJamJson(jamOperasional);
    } catch {
      toast.error("Jam operasional harus JSON array valid atau kosong.");
      return;
    }
    const payload: KontakFormValues = {
      label,
      slug,
      alamatLengkap,
      telepon: linesToArray(telepon),
      email: linesToArray(email),
      whatsapp: whatsapp || "",
      googleMapsUrl: googleMapsUrl || "",
      googleMapsEmbed: googleMapsEmbed || "",
      jamOperasional: jamParsed,
      mediaSosial: linesToMediaSosial(mediaSosial),
      sortOrder,
      layoutConfig,
      showInNav,
      status: nextStatus,
    };
    const parsed = kontakFormSchema.safeParse(payload);
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
          ? await createKontak(parsed.data, token)
          : await updateKontak(id!, parsed.data, token);
      toast.success(
        nextStatus === "PUBLISHED" ? "Kontak diterbitkan." : "Draft disimpan.",
      );
      setStatus(saved.status);
      setInitial(saved);
      navigate(`/kontak/${saved.id}/edit`);
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
    if (!window.confirm(`Hapus kontak "${initial.label}"?`)) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await deleteKontak(initial.id, token);
      toast.success("Kontak dihapus.");
      navigate("/kontak");
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
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tidak dapat memuat</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            {mode === "create" ? "Kontak baru" : "Edit kontak"}
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Lokasi kampus, saluran hubungi, peta, dan jam operasional.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to="/kontak">Kembali</Link>
        </Button>
      </div>

      <form
        className="space-y-5 border border-[color:var(--color-border)] bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save("DRAFT");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-label">Label</Label>
            <Input
              id="k-label"
              value={label}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => {
                const v = e.target.value;
                setLabel(v);
                if (!slugLocked) setSlug(slugifyJudul(v));
              }}
              placeholder="Kantor Pusat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-slug">Slug</Label>
            <Input
              id="k-slug"
              value={slug}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => {
                setSlugLocked(true);
                setSlug(e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-status">Status</Label>
            <StatusSelect
              id="k-status"
              value={status}
              disabled={!canManageSiteContent || busy}
              onChange={setStatus}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-alamat">Alamat lengkap</Label>
            <textarea
              id="k-alamat"
              className={textareaClassName}
              value={alamatLengkap}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setAlamatLengkap(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-telepon">Telepon (satu per baris)</Label>
            <textarea
              id="k-telepon"
              className={textareaClassName}
              value={telepon}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setTelepon(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-email">Email (satu per baris)</Label>
            <textarea
              id="k-email"
              className={textareaClassName}
              value={email}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setEmail(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-wa">WhatsApp</Label>
            <Input
              id="k-wa"
              value={whatsapp}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="0898-8131-858"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="k-sort">Urutan</Label>
            <Input
              id="k-sort"
              type="number"
              min={0}
              value={sortOrder}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-maps-url">Google Maps URL</Label>
            <Input
              id="k-maps-url"
              value={googleMapsUrl}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://www.google.com/maps?q=…"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-maps-embed">Google Maps embed (URL atau iframe)</Label>
            <textarea
              id="k-maps-embed"
              className={textareaClassName}
              value={googleMapsEmbed}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setGoogleMapsEmbed(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-jam">Jam operasional (JSON array)</Label>
            <textarea
              id="k-jam"
              className={textareaClassName}
              value={jamOperasional}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setJamOperasional(e.target.value)}
              placeholder='[{"hari":"Senin–Jumat","buka":"08.00","tutup":"15.00"}]'
              rows={4}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="k-sosial">Media sosial (key=url per baris)</Label>
            <textarea
              id="k-sosial"
              className={textareaClassName}
              value={mediaSosial}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setMediaSosial(e.target.value)}
              placeholder="instagram=https://…"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="k-nav"
              type="checkbox"
              className="size-4 rounded-none border-[color:var(--color-border)]"
              checked={showInNav}
              disabled={!canManageSiteContent || busy}
              onChange={(e) => setShowInNav(e.target.checked)}
            />
            <Label htmlFor="k-nav">Tampilkan di navigasi</Label>
          </div>
        </div>
        <SiteContentLayoutConfigFields
          value={layoutConfig}
          onChange={setLayoutConfig}
          disabled={!canManageSiteContent || busy}
        />

        {canManageSiteContent ? (
          <FormActions
            busy={busy}
            mode={mode}
            id={id}
            status={status}
            reviewNote={initial?.reviewNote}
            onSubmitted={() => setStatus("PENDING_REVIEW")}
            onDelete={mode === "edit" ? () => void onDelete() : undefined}
            onPublish={() => void save("PUBLISHED")}
          />
        ) : null}
      </form>
    </div>
  );
}
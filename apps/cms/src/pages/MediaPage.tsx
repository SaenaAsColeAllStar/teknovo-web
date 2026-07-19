import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { MediaLibrary } from "@/components/dashboard/media/MediaLibrary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiClientError,
  fetchSiteMediaCatalog,
  resetSiteMedia,
  updateSiteMedia,
  type SiteMediaCatalogItem,
} from "@/lib/api-client";

import { useCmsGetToken } from "../lib/use-cms-get-token";

/** Mirrors dashboard media + Super Admin site media registry. */
export function MediaPage() {
  const { getToken, isLoaded } = useCmsGetToken();
  const { canManageSiteMedia, canUploadMedia } = useCmsRole();
  const [items, setItems] = useState<SiteMediaCatalogItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !canManageSiteMedia) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
        const catalog = await fetchSiteMediaCatalog(token);
        if (!cancelled) {
          setItems(catalog);
          setEdits(
            Object.fromEntries(catalog.map((i) => [i.mediaKey, i.url])),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat katalog media situs.",
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
  }, [canManageSiteMedia, getToken, isLoaded]);

  async function saveKey(mediaKey: string) {
    const url = edits[mediaKey]?.trim();
    if (!url) {
      toast.error("URL wajib diisi.");
      return;
    }
    setBusyKey(mediaKey);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      const saved = await updateSiteMedia(mediaKey, { url }, token);
      setItems((prev) =>
        prev.map((i) => (i.mediaKey === mediaKey ? { ...i, ...saved } : i)),
      );
      toast.success("Media situs diperbarui — rebuild dipicu.");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal menyimpan.",
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function resetKey(mediaKey: string) {
    setBusyKey(mediaKey);
    try {
      const token = await getToken();
      if (!token) throw new ApiClientError("Sesi Clerk tidak tersedia", 401);
      await resetSiteMedia(mediaKey, token);
      const catalog = await fetchSiteMediaCatalog(token);
      setItems(catalog);
      setEdits(Object.fromEntries(catalog.map((i) => [i.mediaKey, i.url])));
      toast.success("Kembali ke URL default.");
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal mereset.",
      );
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-10">
      {canManageSiteMedia ? (
        <section className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
              Media situs publik
            </h1>
            <p className="text-sm text-[color:var(--color-body)]">
              Ganti URL foto/logo yang dipakai di situs publik. Setelah disimpan,
              situs di-rebuild otomatis.
            </p>
          </div>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}
          {loading ? (
            <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.mediaKey}
                  className="border border-[color:var(--color-border)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[color:var(--color-heading)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[color:var(--color-body)]">
                        {item.mediaKey} · {item.category}
                        {item.isOverride ? " · override" : " · default"}
                      </p>
                    </div>
                    {item.url ? (
                      <img
                        src={item.url}
                        alt=""
                        className="h-14 w-20 object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor={`media-${item.mediaKey}`}>URL</Label>
                    <Input
                      id={`media-${item.mediaKey}`}
                      value={edits[item.mediaKey] ?? ""}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [item.mediaKey]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={busyKey === item.mediaKey}
                      onClick={() => void saveKey(item.mediaKey)}
                    >
                      Simpan
                    </Button>
                    {item.isOverride ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busyKey === item.mediaKey}
                        onClick={() => void resetKey(item.mediaKey)}
                      >
                        Reset default
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--color-heading)]">
            Library upload CMS
          </h2>
          <p className="text-sm text-[color:var(--color-body)]">
            Upload ke Cloudflare R2 (<code>CMS_BUCKET</code>) via{" "}
            <code>/api/cms/media</code> — untuk cover berita/artikel.
            {!canUploadMedia
              ? " Peran Anda hanya dapat melihat."
              : null}
          </p>
        </div>
        <MediaLibrary fetchOnMount />
      </section>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type DragEvent,
} from "react";
import { Copy, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CmsMediaObject } from "@/lib/cms-media";
import { cn } from "@/lib/utils";

type ListResponse = {
  ok: boolean;
  data?: CmsMediaObject[];
  error?: { message?: string };
};

type Props = {
  initialItems?: CmsMediaObject[];
  initialError?: string | null;
  /** Client-fetch once after mount (media picker in berita form). */
  fetchOnMount?: boolean;
  /** When set, selecting an item calls this instead of only copying URL. */
  onPick?: (url: string) => void;
  compact?: boolean;
};

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageUrl(url: string, key: string): boolean {
  return (
    /\.(jpe?g|png|gif|webp|svg)$/i.test(key) ||
    /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(url)
  );
}

export function MediaLibrary({
  initialItems = [],
  initialError = null,
  fetchOnMount = false,
  onPick,
  compact,
}: Props) {
  const { canWrite, canUploadMedia } = useCmsRole();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<CmsMediaObject[]>(initialItems);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/media?limit=100", { cache: "no-store" });
      const json = (await res.json()) as ListResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message || `Gagal memuat media (${res.status})`);
      }
      setItems(json.data ?? []);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "Gagal memuat media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchOnMount) return;
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchOnMount, load]);

  async function uploadFiles(files: FileList | File[]) {
    if (!canUploadMedia) {
      toast.error("Peran viewer tidak dapat mengunggah media.");
      return;
    }
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    try {
      for (const file of list) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/cms/media", { method: "POST", body });
        const json = (await res.json()) as {
          ok: boolean;
          data?: CmsMediaObject;
          error?: { message?: string };
        };
        if (!res.ok || !json.ok || !json.data) {
          throw new Error(json.error?.message || `Upload gagal (${res.status})`);
        }
        setItems((prev) => [json.data!, ...prev]);
        if (onPick) onPick(json.data.url);
      }
      toast.success(
        list.length === 1 ? "Media diunggah" : `${list.length} file diunggah`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onDelete(item: CmsMediaObject) {
    if (!canWrite) return;
    if (!window.confirm(`Hapus ${item.key}?`)) return;

    try {
      const res = await fetch("/api/cms/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: { message?: string };
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message || `Hapus gagal (${res.status})`);
      }
      setItems((prev) => prev.filter((row) => row.key !== item.key));
      toast.success("Media dihapus");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    if (!canUploadMedia || uploading) return;
    void uploadFiles(event.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      {canUploadMedia ? (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          className={cn(
            "border border-dashed border-[color:var(--color-border)] bg-white px-4 py-8 text-center transition-colors",
            dragOver &&
              "border-[color:var(--color-brand)] bg-[color:var(--color-neutral-soft)]",
          )}
        >
          <Upload className="mx-auto size-8 text-[color:var(--color-brand)]" />
          <p className="mt-3 text-sm font-medium text-[color:var(--color-heading)]">
            Seret file ke sini, atau pilih dari perangkat
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-body-subtle)]">
            JPEG, PNG, WebP, GIF, SVG, PDF · maks. 8 MiB · disimpan di{" "}
            <code>cms/uploads/</code>
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              type="button"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ImagePlus />
              )}
              {uploading ? "Mengunggah…" : "Pilih file"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending || uploading || loading}
              onClick={() => startTransition(() => void load())}
            >
              Muat ulang
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending || loading}
            onClick={() => startTransition(() => void load())}
          >
            Muat ulang
          </Button>
        </div>
      )}

      {loading && items.length === 0 && !error ? (
        <p className="text-sm text-[color:var(--color-body)]">Memuat media…</p>
      ) : null}

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Media tidak tersedia</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Belum ada upload</CardTitle>
            <CardDescription>
              Unggah gambar cover berita atau aset CMS. Binding{" "}
              <code>CMS_BUCKET</code> diperlukan (OpenNext / Workers).
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!error && items.length > 0 ? (
        <ul
          className={cn(
            "grid gap-3",
            compact
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {items.map((item) => (
            <li
              key={item.key}
              className="flex flex-col border border-[color:var(--color-border)] bg-white"
            >
              <button
                type="button"
                className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-neutral-soft)] text-left"
                onClick={() => {
                  if (onPick) {
                    onPick(item.url);
                    toast.success("URL dipilih");
                  } else {
                    void navigator.clipboard.writeText(item.url);
                    toast.success("URL disalin");
                  }
                }}
              >
                {isImageUrl(item.url, item.key) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center p-3 text-center text-xs text-[color:var(--color-body)]">
                    {item.key.split("/").pop()}
                  </div>
                )}
              </button>
              <div className="space-y-2 p-3">
                <p
                  className="truncate text-xs font-medium text-[color:var(--color-heading)]"
                  title={item.key}
                >
                  {item.key.replace(/^cms\/uploads\//, "")}
                </p>
                <p className="text-[11px] text-[color:var(--color-body-subtle)]">
                  {formatBytes(item.size)}
                </p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      void navigator.clipboard.writeText(item.url);
                      toast.success("URL disalin");
                    }}
                  >
                    <Copy />
                    URL
                  </Button>
                  {canWrite ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="danger"
                      className="size-8"
                      aria-label="Hapus"
                      onClick={() => void onDelete(item)}
                    >
                      <Trash2 />
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

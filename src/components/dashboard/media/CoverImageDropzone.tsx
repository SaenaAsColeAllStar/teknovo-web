"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CoverImageDropzoneProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** Allow non-image (e.g. prestasi PDF). Default: images only. */
  accept?: Record<string, string[]>;
  label?: string;
  placeholder?: string;
  className?: string;
};

type UploadJson = {
  ok: boolean;
  data?: { url: string; key?: string };
  error?: { message?: string };
};

async function uploadCmsMediaFile(file: File): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  const res = await fetch("/api/cms/media", { method: "POST", body });
  const json = (await res.json()) as UploadJson;
  if (!res.ok || !json.ok || !json.data?.url) {
    throw new Error(json.error?.message || `Upload gagal (${res.status})`);
  }
  return json.data.url;
}

const DEFAULT_ACCEPT: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
};

/**
 * Direct media upload via existing `/api/cms/media` (Clerk-patched in CMS SPA).
 * Keeps URL input for paste/edit; dropzone fills the same field.
 */
export function CoverImageDropzone({
  value,
  onChange,
  disabled,
  accept = DEFAULT_ACCEPT,
  label = "Seret gambar ke sini, atau klik untuk unggah",
  placeholder = "https://...",
  className,
}: CoverImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file || disabled) return;
      setUploading(true);
      try {
        const url = await uploadCmsMediaFile(file);
        onChange(url);
        toast.success("Media diunggah");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload gagal.");
      } finally {
        setUploading(false);
      }
    },
    [disabled, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      void onDrop(files);
    },
    accept,
    maxFiles: 1,
    disabled: disabled || uploading,
    multiple: false,
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-8 text-center transition-colors",
          isDragActive && "border-[color:var(--color-brand)] bg-white",
          (disabled || uploading) && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2
            className="size-6 animate-spin text-[color:var(--color-brand)]"
            aria-hidden
          />
        ) : (
          <ImagePlus
            className="size-6 text-[color:var(--color-body)]"
            aria-hidden
          />
        )}
        <p className="text-sm text-[color:var(--color-heading)]">
          {uploading ? "Mengunggah…" : label}
        </p>
        <p className="text-xs text-[color:var(--color-body)]">
          Atau tempel URL di bawah
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={value}
          disabled={disabled || uploading}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled || uploading}
            aria-label="Hapus URL"
            onClick={() => onChange("")}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      {value && /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value) ? (
        <div className="border border-[color:var(--color-border)] bg-white p-2">
          <img
            src={value}
            alt="Pratinjau cover"
            className="max-h-40 w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}

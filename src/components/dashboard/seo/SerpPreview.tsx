import { cn } from "@/lib/utils";

type SerpPreviewProps = {
  title: string;
  url: string;
  description: string;
  className?: string;
};

/** Lightweight Google SERP result simulator for SEO fields. */
export function SerpPreview({
  title,
  url,
  description,
  className,
}: SerpPreviewProps) {
  const displayTitle = title.trim() || "Judul halaman contoh";
  const displayUrl = url.trim() || "https://smkteknovo.sch.id/…";
  const displayDesc =
    description.trim() ||
    "Deskripsi meta akan muncul di sini setelah diisi atau digenerate.";

  return (
    <div
      className={cn(
        "rounded-none border border-[color:var(--color-border)] bg-white p-4 font-sans",
        className,
      )}
      aria-label="Pratinjau hasil pencarian Google"
    >
      <p className="text-xs text-[#006621] truncate">{displayUrl}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-[#1a0dab]">
        {displayTitle}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-[#545454]">{displayDesc}</p>
    </div>
  );
}

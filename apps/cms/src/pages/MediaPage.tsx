import { MediaLibrary } from "@/components/dashboard/media/MediaLibrary";

/** Mirrors `src/app/(dashboard)/dashboard/media/page.tsx` — CMS SPA fetches client-side. */
export function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Media
        </h1>
        <p className="text-sm text-[color:var(--color-body)]">
          Upload ke Cloudflare R2 (<code>CMS_BUCKET</code>) via{" "}
          <code>/api/cms/media</code>. URL publik memakai <code>R2_PUBLIC_URL</code>.
        </p>
      </div>
      <MediaLibrary fetchOnMount />
    </div>
  );
}

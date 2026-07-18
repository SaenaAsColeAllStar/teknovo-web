import { MediaLibrary } from "@/components/dashboard/media/MediaLibrary";
import { listCmsUploads, mediaErrorMessage } from "@/lib/cms-media";
import type { CmsMediaObject } from "@/lib/cms-media";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let initialItems: CmsMediaObject[] = [];
  let initialError: string | null = null;

  try {
    const result = await listCmsUploads({ limit: 100 });
    initialItems = result.objects;
  } catch (err) {
    initialError = mediaErrorMessage(err);
  }

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
      <MediaLibrary initialItems={initialItems} initialError={initialError} />
    </div>
  );
}

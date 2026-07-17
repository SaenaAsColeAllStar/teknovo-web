"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand cache bust after CMS publish/update.
 * Homelab api-web may also POST `/api/revalidate` with REVALIDATE_SECRET.
 */
export async function revalidateBeritaCache(slug?: string): Promise<void> {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  revalidateTag("berita", "max");
  revalidatePath("/berita");
  revalidatePath("/berita/kegiatan-sekolah");
  revalidatePath("/berita/berita-terbaru");
  revalidatePath("/");

  if (slug) {
    revalidateTag(`berita:${slug}`, "max");
    revalidatePath(`/berita/kegiatan/${slug}`);
    revalidatePath(`/berita/${slug}`);
  }
}

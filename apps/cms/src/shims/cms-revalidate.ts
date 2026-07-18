/**
 * Shim `@/lib/cms-revalidate` — the real module uses Next.js server actions
 * (`"use server"`, `@clerk/nextjs/server`, `next/cache`) which don't exist in a
 * Vite SPA. The Cloudflare API already triggers the `rebuild-web` GitHub Action
 * after publish/approve (see `apps/api/src/lib/rebuild-web.ts`), so these are
 * intentionally no-ops here.
 */
export async function revalidateBeritaCache(_slug?: string): Promise<void> {}

export async function revalidateArtikelSiswaCache(_slug?: string): Promise<void> {}

export async function revalidateKategoriCache(): Promise<void> {}

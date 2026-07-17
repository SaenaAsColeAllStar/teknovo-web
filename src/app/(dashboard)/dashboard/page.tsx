import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { FilePlus2, Newspaper, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardHomePage() {
  const user = await currentUser();
  const nama =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Editor";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Halo, {nama}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Kelola berita, kategori, dan media portal SMK Teknovo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Newspaper className="size-4" /> Berita
            </CardTitle>
            <CardDescription>Draft & publikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/berita">Kelola</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FilePlus2 className="size-4" /> Tulis baru
            </CardTitle>
            <CardDescription>Buat artikel berita</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link href="/dashboard/berita/baru">Buat berita</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tags className="size-4" /> Kategori
            </CardTitle>
            <CardDescription>Taksonomi konten</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/kategori">Kelola</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status integrasi</CardTitle>
          <CardDescription>
            CMS ini memanggil API homelab (`API_URL`). Lihat docs/API.md.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[color:var(--color-body)]">
          <p>
            API_URL:{" "}
            <code className="bg-[color:var(--color-neutral-soft)] px-1">
              {process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "(belum diset)"}
            </code>
          </p>
          <p>
            Clerk: autentikasi aktif via middleware. Webhook stub di{" "}
            <code>/api/webhook/clerk</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

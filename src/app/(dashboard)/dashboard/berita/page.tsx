import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardBeritaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
            Berita
          </h1>
          <p className="text-sm text-[color:var(--color-body)]">
            Daftar akan diisi dari `GET /v1/berita` setelah API homelab hidup.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/berita/baru">Berita baru</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Belum ada data</CardTitle>
          <CardDescription>
            Scaffold siap — hubungkan api-client ke services/api-web.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

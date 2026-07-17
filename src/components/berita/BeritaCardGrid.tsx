import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BeritaListItem } from "@/types/berita";

type Props = {
  items: BeritaListItem[];
  emptyHint?: string;
};

export function BeritaCardGrid({ items, emptyHint }: Props) {
  if (items.length === 0) {
    return (
      <div className="border border-[color:var(--color-border)] bg-white px-6 py-12 text-center">
        <p className="text-[color:var(--color-body)]">
          {emptyHint ??
            "Belum ada berita dari API. Hubungkan API_URL atau publikasikan konten dari CMS."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link key={item.id} href={`/berita/${item.slug}`} className="group block">
          <Card className="h-full transition-colors group-hover:border-[color:var(--color-brand)]">
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg group-hover:text-[color:var(--color-brand)]">
                {item.judul}
              </CardTitle>
              <CardDescription>
                {item.publishedAt
                  ? format(new Date(item.publishedAt), "d MMMM yyyy", {
                      locale: localeId,
                    })
                  : "Draft"}
                {item.kategori ? ` · ${item.kategori.nama}` : null}
              </CardDescription>
            </CardHeader>
            {item.ringkasan ? (
              <CardContent>
                <p className="line-clamp-3 text-sm text-[color:var(--color-body)]">
                  {item.ringkasan}
                </p>
              </CardContent>
            ) : null}
          </Card>
        </Link>
      ))}
    </div>
  );
}

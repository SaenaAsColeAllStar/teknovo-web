import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PengaturanForm } from "@/components/dashboard/pengaturan/PengaturanForm";
import {
  fetchPengaturanCms,
  isApiConfigured,
} from "@/lib/api-client";
import { getCmsSession } from "@/lib/cms-auth";
import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
} from "@/lib/pengaturan-situs-publik-defaults";
import { getForAdmin } from "@/services/pengaturan-situs-publik";

export const dynamic = "force-dynamic";

function defaultsData(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

export default async function PengaturanPage() {
  const session = await getCmsSession();
  if (!session?.canManageSettings) {
    redirect("/dashboard");
  }

  let initial = defaultsData();
  let loadNote: string | null = null;

  if (isApiConfigured()) {
    try {
      const { getToken } = await auth();
      const token = await getToken();
      if (token) {
        initial = await fetchPengaturanCms(token);
      } else {
        initial = await getForAdmin();
        loadNote = "Sesi token tidak tersedia — menampilkan fallback publik.";
      }
    } catch {
      initial = await getForAdmin();
      loadNote =
        "API pengaturan belum tersedia — menampilkan default lokal. Simpan akan gagal sampai api-web mengimplementasikan PATCH /v1/pengaturan.";
    }
  } else {
    loadNote = "API_URL belum diset — form memakai default lokal.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Metadata situs, SEO, kontak, PPDB, dan tautan sosial. Hanya peran{" "}
          <code>admin</code>.
        </p>
        {loadNote ? (
          <p className="mt-2 text-xs text-[color:var(--color-body-subtle)]">
            {loadNote}
          </p>
        ) : null}
      </div>
      <PengaturanForm initial={initial} />
    </div>
  );
}

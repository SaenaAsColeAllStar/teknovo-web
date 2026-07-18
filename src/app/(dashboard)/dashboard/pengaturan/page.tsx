import { redirect } from "next/navigation";

import { getCmsSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const session = await getCmsSession();
  if (!session?.canManageSettings) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
        Pengaturan
      </h1>
      <p className="text-sm text-[color:var(--color-body)]">
        Scaffold (P3) — metadata situs, revalidate secret, dan manajemen peran CMS.
        Hanya peran <code>admin</code> yang dapat membuka halaman ini.
      </p>
    </div>
  );
}

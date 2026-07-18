import { redirect } from "next/navigation";

import { PenggunaManager } from "@/components/dashboard/pengguna/PenggunaManager";
import { getCmsSession } from "@/lib/cms-auth";

export default async function PenggunaPage() {
  const session = await getCmsSession();
  if (!session?.canManageUsers) {
    redirect("/dashboard");
  }

  return <PenggunaManager currentUserId={session.userId} />;
}

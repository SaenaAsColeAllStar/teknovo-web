import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import {
  cmsRoleCanManageSettings,
  parseCmsRole,
} from "@teknovo/shared";

import { PenggunaManager } from "@/components/dashboard/pengguna/PenggunaManager";

/** Super Admin only — mirrors `/dashboard/pengaturan` gate. */
export function PenggunaPage() {
  const { isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
    );
  }

  const role = parseCmsRole(user?.publicMetadata);
  if (!cmsRoleCanManageSettings(role)) {
    return <Navigate to="/" replace />;
  }

  return <PenggunaManager currentUserId={user?.id ?? null} />;
}

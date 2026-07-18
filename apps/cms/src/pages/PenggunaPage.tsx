import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import {
  cmsRoleCanManageUsers,
  parseCmsRole,
} from "@teknovo/shared";

import { PenggunaManager } from "@/components/dashboard/pengguna/PenggunaManager";

/** Super Admin + Admin (`editor`) — invite/create users per role matrix. */
export function PenggunaPage() {
  const { isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
    );
  }

  const role = parseCmsRole(user?.publicMetadata);
  if (!cmsRoleCanManageUsers(role)) {
    return <Navigate to="/" replace />;
  }

  return <PenggunaManager currentUserId={user?.id ?? null} />;
}

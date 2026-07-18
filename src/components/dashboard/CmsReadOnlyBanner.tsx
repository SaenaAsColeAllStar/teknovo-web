"use client";

import { useCmsRole } from "@/components/dashboard/CmsRoleProvider";
import { CMS_ROLE_LABEL } from "@/lib/clerk";

export function CmsReadOnlyBanner() {
  const { role, canWrite } = useCmsRole();
  if (canWrite) return null;

  return (
    <div
      role="status"
      className="border border-[color:var(--color-border)] bg-[color:var(--color-neutral-soft)] px-4 py-3 text-sm text-[color:var(--color-body)]"
    >
      <p className="font-medium text-[color:var(--color-heading)]">
        Mode baca saja ({CMS_ROLE_LABEL[role]})
      </p>
      <p className="mt-1">
        Anda dapat melihat konten CMS, tetapi tidak dapat membuat, mengubah, atau
        menghapus. Minta admin menaikkan peran ke <code>editor</code> atau{" "}
        <code>admin</code> di Clerk <code>publicMetadata.role</code>.
      </p>
    </div>
  );
}

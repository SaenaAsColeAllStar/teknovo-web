import type { CmsRole } from "@/lib/clerk";

export type CmsUser = {
  id: string;
  clerkId: string;
  email: string;
  nama: string;
  role: CmsRole;
  avatarUrl?: string | null;
  createdAt: string;
};

"use client";

import { usePathname } from "next/navigation";

import { toPublicSiteNavPathname } from "@/lib/public-site-path";

const publicAppId = process.env.NEXT_PUBLIC_TEKNOVO_PUBLIC_APP;

const publicSiteAppId =
  publicAppId === "ppdb" || publicAppId === "landing" ? publicAppId : undefined;

export function usePublicSitePathname(): string {
  const routerPathname = usePathname() ?? "/";
  return toPublicSiteNavPathname(routerPathname, publicSiteAppId);
}

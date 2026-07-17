import Link from "next/link";
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from "react";

import {
  shouldUsePublicSiteClientNavigation,
  type PublicSiteAppId,
} from "@/lib/public-site-path";
import { cn } from "@/lib/utils";

type PublicSiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

const publicAppId = process.env.NEXT_PUBLIC_TEKNOVO_PUBLIC_APP;

function resolveAppId(): PublicSiteAppId | undefined {
  if (publicAppId === "ppdb" || publicAppId === "landing") {
    return publicAppId;
  }
  return undefined;
}

/**
 * Tautan situs publik: navigasi klien (`next/link`) di dalam app yang sama,
 * muatan penuh (`<a>`) ke app lain (ppdb, console, eksternal).
 */
export function PublicSiteLink({
  href,
  className,
  children,
  ...props
}: PublicSiteLinkProps): ReactElement {
  const appId = resolveAppId();

  if (shouldUsePublicSiteClientNavigation(href, appId)) {
    return (
      <Link href={href} className={cn(className)} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cn(className)} {...props}>
      {children}
    </a>
  );
}

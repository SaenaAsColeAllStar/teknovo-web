import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";

import { getLenis, scrollToPublic } from "@/lib/lenis-public";
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

function isSameDocumentHash(href: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname !== window.location.pathname) return null;
    if (!url.hash || url.hash === "#") return null;
    return url.hash;
  } catch {
    return null;
  }
}

/**
 * Tautan situs publik: navigasi klien (`next/link`) di dalam app yang sama,
 * muatan penuh (`<a>`) ke app lain (ppdb, console, eksternal).
 * Same-page `#hash` → Lenis when active; native/smooth fallback otherwise.
 */
export function PublicSiteLink({
  href,
  className,
  children,
  onClick,
  ...props
}: PublicSiteLinkProps): ReactElement {
  const appId = resolveAppId();

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hash = isSameDocumentHash(href);
    if (!hash) return;

    // SmoothScrollProvider capture + Lenis `anchors` own this path when mounted.
    if (getLenis()) return;

    event.preventDefault();
    if (window.location.hash !== hash) {
      history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${hash}`,
      );
    }
    scrollToPublic(hash);
  }

  if (shouldUsePublicSiteClientNavigation(href, appId)) {
    return (
      <Link href={href} className={cn(className)} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cn(className)} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

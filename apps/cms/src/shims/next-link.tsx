import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import { toRealPath } from "./cms-route-path";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

/** Shim `next/link` → `react-router-dom` Link; rewrites `/dashboard/...` hrefs to real SPA routes. */
export default function Link({
  href,
  children,
  prefetch: _prefetch,
  replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  legacyBehavior: _legacyBehavior,
  ...rest
}: LinkProps) {
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith("mailto:")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={toRealPath(href)} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}

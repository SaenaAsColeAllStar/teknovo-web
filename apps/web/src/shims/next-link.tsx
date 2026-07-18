import type { AnchorHTMLAttributes, ReactNode } from "react";

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

/** Shim next/link → plain anchor (Astro full page loads). */
export default function Link({
  href,
  children,
  prefetch: _p,
  replace: _r,
  scroll: _s,
  shallow: _sh,
  passHref: _ph,
  legacyBehavior: _lb,
  ...rest
}: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

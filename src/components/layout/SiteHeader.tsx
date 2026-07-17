import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  BRAND_LOGO_SRC,
  BRAND_SHORT,
  SITE_NAV,
} from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={BRAND_LOGO_SRC}
            alt={BRAND_SHORT}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-[color:var(--color-heading)]">
            {BRAND_SHORT}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Menu utama">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--color-body)] transition-colors hover:text-[color:var(--color-heading)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
            <Link href="/sign-in">CMS Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="https://smkteknovo.sch.id/ppdb" target="_blank" rel="noreferrer">
              PPDB
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

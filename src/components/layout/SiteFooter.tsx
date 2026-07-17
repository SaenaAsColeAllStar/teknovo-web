import Image from "next/image";
import Link from "next/link";

import {
  BRAND_LOGO_SRC,
  BRAND_SCHOOL_FULL,
  BRAND_SHORT,
  CONTACT,
  SITE_NAV,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[color:var(--color-brand)] text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src={BRAND_LOGO_SRC}
              alt={BRAND_SHORT}
              width={48}
              height={48}
              className="h-12 w-12 rounded-none bg-white object-contain p-1"
            />
            <div>
              <p className="text-lg font-semibold">{BRAND_SHORT}</p>
              <p className="text-sm text-white/80">{BRAND_SCHOOL_FULL}</p>
            </div>
          </div>
          <p className="text-sm text-white/75">{CONTACT.address}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
            Navigasi
          </p>
          <ul className="space-y-2">
            {SITE_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
            Kontak
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {CONTACT.email}
              </a>
            </li>
            <li>{CONTACT.phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[1280px] px-4 py-4 text-xs text-white/60 md:px-6">
          © {new Date().getFullYear()} {BRAND_SCHOOL_FULL}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}

/**
 * Navbar situs publik — re-export three-tier marketing chrome.
 * Dipakai `PublicSiteLayout` (landing & admissions).
 * Beranda memakai `HomeCardNav` di hero; chrome tiga tingkat disembunyikan di `/`.
 */
export {
  PublicMarketingNavbar as PublicNavbar,
  type PublicMarketingNavbarProps as PublicNavbarProps,
} from "@/components/layout/PublicMarketingNavbar";

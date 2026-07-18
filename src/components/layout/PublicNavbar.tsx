/**
 * Navbar situs publik — re-export three-tier marketing chrome.
 * Dipakai `PublicSiteLayout` (landing & admissions).
 * Beranda memakai overlay di `HeroSection`; chrome ini disembunyikan di `/`.
 */
export {
  PublicMarketingNavbar as PublicNavbar,
  type PublicMarketingNavbarProps as PublicNavbarProps,
} from "@/components/layout/PublicMarketingNavbar";

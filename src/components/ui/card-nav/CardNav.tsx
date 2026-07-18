"use client";

import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { cn } from "@/lib/utils";

import "./CardNav.css";

export type CardNavLink = {
  label: string;
  href?: string;
  ariaLabel?: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export type CardNavProps = {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  /** CTA label (default Get Started — site uses PPDB). */
  ctaLabel?: string;
  /** CTA href; when set, CTA renders as PublicSiteLink. */
  ctaHref?: string;
  /** Logo home link (default `/`). */
  logoHref?: string;
};

export function CardNav({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaLabel = "Get Started",
  ctaHref,
  logoHref = "/",
}: CardNavProps): ReactElement {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl instanceof HTMLElement) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate when ease/items change
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when expanded toggles
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const onHamburgerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  const ctaStyle = {
    backgroundColor: buttonBgColor,
    color: buttonTextColor,
  };

  return (
    <div className={cn("card-nav-container", className)}>
      <nav
        ref={navRef}
        className={cn("card-nav", isExpanded && "open")}
        style={{ backgroundColor: baseColor }}
        aria-label="Navigasi utama"
      >
        <div className="card-nav-top">
          <div
            className={cn("hamburger-menu", isHamburgerOpen && "open")}
            onClick={toggleMenu}
            onKeyDown={onHamburgerKeyDown}
            role="button"
            aria-label={isExpanded ? "Tutup menu" : "Buka menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <PublicSiteLink
              href={logoHref}
              aria-label={logoAlt}
              className="inline-flex items-center"
            >
              <img src={logo} alt={logoAlt} className="logo" />
            </PublicSiteLink>
          </div>

          {ctaHref ? (
            <PublicSiteLink
              href={ctaHref}
              className="card-nav-cta-button"
              style={ctaStyle}
            >
              {ctaLabel}
            </PublicSiteLink>
          ) : (
            <button
              type="button"
              className="card-nav-cta-button"
              style={ctaStyle}
            >
              {ctaLabel}
            </button>
          )}
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => {
                  const href = lnk.href ?? "#";
                  return (
                    <PublicSiteLink
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link"
                      href={href}
                      aria-label={lnk.ariaLabel}
                      tabIndex={isExpanded ? undefined : -1}
                    >
                      <ArrowUpRight
                        className="nav-card-link-icon"
                        aria-hidden
                      />
                      {lnk.label}
                    </PublicSiteLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default CardNav;

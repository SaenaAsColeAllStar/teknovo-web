import type { ReactElement } from "react";

import { CounterUpNumber } from "@/components/features/landing/home/CounterUpNumber";
import { SocialProofCarousel } from "@/components/features/landing/home/SocialProofCarousel";
import { IcoChevronRight } from "@/components/icons/inline-glyphs";
import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  HOME_SOCIAL_PROOF_LINK_HREF,
  HOME_SOCIAL_PROOF_LINK_LABEL,
  HOME_SOCIAL_PROOF_SLIDES,
  HOME_SOCIAL_PROOF_TITLE,
} from "@/lib/home-landing-content";
import { getLandingPublicStats } from "@/services/landing-stats";

export async function SocialProofSection(): Promise<ReactElement> {
  const stats = await getLandingPublicStats();

  return (
    <MotionInView
      as="section"
      aria-labelledby="social-proof-heading"
      className="border-y border-border-default bg-surface py-14 sm:py-16"
    >
      <div className="public-site-container">
        <MotionInView as="header" className="mx-auto max-w-2xl text-center">
          <h2
            id="social-proof-heading"
            className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
          >
            {HOME_SOCIAL_PROOF_TITLE}
          </h2>
          <PublicSiteLink
            href={HOME_SOCIAL_PROOF_LINK_HREF}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            {HOME_SOCIAL_PROOF_LINK_LABEL}
            <IcoChevronRight className="size-4" aria-hidden />
          </PublicSiteLink>
        </MotionInView>

        <div className="mt-8 sm:mt-10">
          <SocialProofCarousel slides={HOME_SOCIAL_PROOF_SLIDES} />
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                <span>
                  {s.prefix ?? ""}
                  <CounterUpNumber value={s.value} suffix={s.suffix} />
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-body">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </MotionInView>
  );
}

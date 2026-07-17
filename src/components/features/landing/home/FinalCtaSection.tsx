import { ClipboardList, MessageCircle } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { PublicSiteLink } from "@/components/layout/PublicSiteLink";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  HOME_FINAL_CTA_BODY,
  HOME_FINAL_CTA_CONTACT_CAPTION,
  HOME_FINAL_CTA_CONTACT_HREF,
  HOME_FINAL_CTA_CONTACT_LABEL,
  HOME_FINAL_CTA_PPDB_CAPTION,
  HOME_FINAL_CTA_PPDB_HREF,
  HOME_FINAL_CTA_PPDB_LABEL,
  HOME_FINAL_CTA_TITLE,
} from "@/lib/home-landing-content";
import { cn } from "@/lib/utils";

type StoreCtaButtonProps = {
  href: string;
  caption: string;
  label: string;
  icon: ReactNode;
};

function StoreCtaButton({ href, caption, label, icon }: StoreCtaButtonProps): ReactElement {
  return (
    <PublicSiteLink
      href={href}
      className={cn(
        "inline-flex h-14 min-w-0 shrink-0 items-center gap-3 rounded-xl bg-slate-950 px-4 text-white",
        "transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "sm:px-5",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center text-white" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="text-[10px] font-medium tracking-wide text-white/75">{caption}</span>
        <span className="truncate text-sm font-semibold whitespace-nowrap">{label}</span>
      </span>
    </PublicSiteLink>
  );
}

export function FinalCtaSection(): ReactElement {
  return (
    <section className="bg-white py-14 sm:py-16" aria-labelledby="cta-final-heading">
      <MotionInView as="div" className="public-site-container" delay={0.08}>
        <div id="cta-final" className="overflow-hidden rounded-2xl border border-border-default bg-surface">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-14 xl:py-14">
            <h2
              id="cta-final-heading"
              className="max-w-xl text-3xl font-bold tracking-tight text-heading sm:text-4xl xl:text-[2.75rem] xl:leading-[1.15]"
            >
              {HOME_FINAL_CTA_TITLE}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              {HOME_FINAL_CTA_BODY}
            </p>
            <div className="mt-8 flex flex-nowrap items-center gap-3 overflow-x-auto pb-0.5 sm:gap-4">
              <StoreCtaButton
                href={HOME_FINAL_CTA_PPDB_HREF}
                caption={HOME_FINAL_CTA_PPDB_CAPTION}
                label={HOME_FINAL_CTA_PPDB_LABEL}
                icon={<ClipboardList className="size-7" strokeWidth={1.75} />}
              />
              <StoreCtaButton
                href={HOME_FINAL_CTA_CONTACT_HREF}
                caption={HOME_FINAL_CTA_CONTACT_CAPTION}
                label={HOME_FINAL_CTA_CONTACT_LABEL}
                icon={<MessageCircle className="size-7" strokeWidth={1.75} />}
              />
            </div>
          </div>
        </div>
      </MotionInView>
    </section>
  );
}

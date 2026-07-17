import type { ReactElement, ReactNode } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import {
  publicPageHeroEyebrowClassName,
  publicPageHeroLedeClassName,
  publicPageHeroTitleClassName,
  publicSectionIntroClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string | readonly string[];
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  titleAdornment?: ReactNode;
  children?: ReactNode;
};

export function PublicPageHero({
  eyebrow,
  title,
  lede,
  className,
  eyebrowClassName,
  titleClassName,
  titleAdornment,
  children,
}: PublicPageHeroProps): ReactElement {
  const ledeParagraphs = Array.isArray(lede) ? lede : [lede];

  return (
    <MotionInView as="header" className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className={cn(publicPageHeroEyebrowClassName, eyebrowClassName)}>{eyebrow}</p>
      {titleAdornment ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {titleAdornment}
          <h1 className={cn(publicPageHeroTitleClassName, "mt-0", titleClassName)}>{title}</h1>
        </div>
      ) : (
        <h1 className={cn(publicPageHeroTitleClassName, titleClassName)}>{title}</h1>
      )}
      <div className={ledeParagraphs.length > 1 ? "mx-auto mt-5 max-w-2xl space-y-4" : undefined}>
        {ledeParagraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className={cn(publicPageHeroLedeClassName, publicSectionIntroClassName, ledeParagraphs.length > 1 && "mt-0")}
          >
            {paragraph}
          </p>
        ))}
      </div>
      {children}
    </MotionInView>
  );
}

import type { ReactElement, ReactNode } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import {
  publicSectionEyebrowClassName,
  publicSectionIntroClassName,
  publicSectionTitleClassName,
} from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

export type PublicSectionHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string | readonly string[];
  icon?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function PublicSectionHeader({
  eyebrow,
  title,
  intro,
  icon,
  className,
  titleClassName,
}: PublicSectionHeaderProps): ReactElement {
  const introParagraphs = intro == null ? [] : Array.isArray(intro) ? intro : [intro];

  return (
    <MotionInView as="header" className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className={publicSectionEyebrowClassName}>{eyebrow}</p>
      {icon ? (
        <div className="mt-3 flex flex-col items-center gap-4">
          {icon}
          <h2 className={cn(publicSectionTitleClassName, titleClassName)}>{title}</h2>
        </div>
      ) : (
        <h2 className={cn("mt-2", publicSectionTitleClassName, titleClassName)}>{title}</h2>
      )}
      {introParagraphs.length > 0 ? (
        <div className="mt-4 space-y-3">
          {introParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className={cn("text-sm leading-relaxed text-slate-600 dark:text-slate-300", publicSectionIntroClassName)}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </MotionInView>
  );
}

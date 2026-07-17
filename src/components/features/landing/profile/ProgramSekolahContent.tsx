import type { ReactElement } from "react";

import {
  PublicSplitContentCard,
  publicSplitCardShellClassName,
} from "@/components/features/landing/PublicSplitContentCard";
import { ProfilPageShell } from "@/components/features/landing/profile/ProfilPageShell";
import { MotionInView } from "@/components/motion/MotionInView";
import {
  PROGRAM_SEKOLAH_HERO_EYEBROW,
  PROGRAM_SEKOLAH_PAGE_LEDE,
  PROGRAM_SEKOLAH_PAGE_TITLE,
} from "@/lib/program-sekolah-content";
import { cn } from "@/lib/utils";

import { SCHOOL_PROGRAMS } from "./school-programs";

export function ProgramSekolahContent(): ReactElement {
  return (
    <ProfilPageShell
      eyebrow={PROGRAM_SEKOLAH_HERO_EYEBROW}
      title={PROGRAM_SEKOLAH_PAGE_TITLE}
      lede={PROGRAM_SEKOLAH_PAGE_LEDE}
    >
      <ul className="mt-10 grid gap-4 lg:grid-cols-2">
        {SCHOOL_PROGRAMS.map((program, idx) => (
          <MotionInView
            as="li"
            key={program.title}
            className={cn(publicSplitCardShellClassName, "min-h-[16rem] sm:min-h-[18rem]")}
            delay={0.06 * idx}
          >
            <PublicSplitContentCard
              tone="neutral"
              insetImage
              image={{
                src: program.coverSrc,
                alt: program.title,
                quality: 65,
              }}
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {program.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{program.description}</p>
              </div>
            </PublicSplitContentCard>
          </MotionInView>
        ))}
      </ul>
    </ProfilPageShell>
  );
}

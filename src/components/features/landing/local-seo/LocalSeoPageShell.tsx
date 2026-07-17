import Link from "next/link";
import type { ReactElement } from "react";

import { PublicPageHero } from "@/components/features/landing/PublicPageHero";
import { MotionInView } from "@/components/motion/MotionInView";
import { getLocalSeoPageConfig, type LocalSeoPageId } from "@/lib/local-seo-keywords";
import { publicPageSectionWhiteClassName } from "@/lib/public-section-styles";
import { cn } from "@/lib/utils";

type LocalSeoPageShellProps = {
  pageId: LocalSeoPageId;
};

export function LocalSeoPageShell({ pageId }: LocalSeoPageShellProps): ReactElement {
  const page = getLocalSeoPageConfig(pageId);

  return (
    <article className={cn(publicPageSectionWhiteClassName, "pb-16")}>
      <div className="public-site-container">
        <PublicPageHero eyebrow={page.eyebrow} title={page.h1} lede={page.lede} />

        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {page.sections.map((section) => (
            <MotionInView
              key={section.heading}
              as="section"
              className="space-y-4"
              delay={0.04}
            >
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))}
            </MotionInView>
          ))}
        </div>

        {page.internalLinks.length > 0 ? (
          <MotionInView as="section" className="mx-auto mt-14 max-w-3xl" delay={0.06}>
            <nav aria-label="Tautan terkait">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tautan terkait</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {page.internalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex flex-col rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
                    >
                      <span className="font-medium text-blue-700 group-hover:text-blue-800 dark:text-blue-400">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </MotionInView>
        ) : null}
      </div>
    </article>
  );
}

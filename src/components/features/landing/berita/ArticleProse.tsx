import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const articleProseClassName = cn(
  "prose prose-slate max-w-none text-base leading-[1.8] text-body dark:prose-invert sm:text-[1.0625rem] sm:leading-[1.85]",
  "prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-heading",
  "prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl",
  "prose-p:my-4 prose-p:text-body",
  "prose-li:my-1.5 prose-ul:my-4 prose-ol:my-4",
  "prose-blockquote:border-l-brand prose-blockquote:bg-neutral-soft prose-blockquote:py-1 prose-blockquote:not-italic",
  "prose-img:my-8 prose-img:rounded-none prose-img:border prose-img:border-border-default",
  "prose-a:font-medium prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
  "prose-strong:font-semibold prose-strong:text-heading",
  "prose-hr:my-10 prose-hr:border-border-default",
  "prose-pre:rounded-none prose-pre:border prose-pre:border-border-default prose-pre:bg-heading prose-pre:text-white",
);

type ArticleProseProps = {
  children?: ReactNode;
  className?: string;
  /** Untuk HTML yang sudah disanitasi — gunakan `html` saja, jangan campur dengan `children`. */
  html?: string;
};

/**
 * Tipografi artikel berita — kolom bacaan nyaman, heading & media konsisten.
 */
export function ArticleProse({ children, className, html }: ArticleProseProps): ReactElement {
  if (html !== undefined) {
    return (
      <div
        className={cn(articleProseClassName, className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <div className={cn(articleProseClassName, className)}>{children}</div>;
}

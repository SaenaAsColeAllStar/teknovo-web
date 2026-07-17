import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const articleProseClassName = cn(
  "prose prose-slate max-w-none text-base leading-[1.75] dark:prose-invert",
  "prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white",
  "prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl",
  "prose-p:my-4 prose-p:text-slate-700 dark:prose-p:text-slate-300",
  "prose-li:my-1.5 prose-ul:my-4 prose-ol:my-4",
  "prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:not-italic",
  "dark:prose-blockquote:border-l-blue-400 dark:prose-blockquote:bg-slate-900/50",
  "prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-sm",
  "prose-a:font-medium prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400",
  "prose-strong:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-white",
  "prose-hr:my-10 prose-hr:border-slate-200 dark:prose-hr:border-slate-800",
  "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100",
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

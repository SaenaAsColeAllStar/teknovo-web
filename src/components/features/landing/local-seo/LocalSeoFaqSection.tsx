import type { ReactElement } from "react";

import { MotionInView } from "@/components/motion/MotionInView";
import { AI_SEARCH_FAQ_ITEMS } from "@/lib/ai-search-faq";

/** Blok FAQ untuk halaman tentang & optimasi AI search. */
export function LocalSeoFaqSection(): ReactElement {
  return (
    <MotionInView as="section" className="mx-auto mt-14 max-w-3xl" delay={0.08}>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        Pertanyaan yang sering diajukan
      </h2>
      <dl className="mt-6 space-y-6">
        {AI_SEARCH_FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <dt className="text-base font-semibold text-slate-900 dark:text-white">{item.question}</dt>
            <dd className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </MotionInView>
  );
}

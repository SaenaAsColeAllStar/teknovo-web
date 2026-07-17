import type { ReactElement } from "react";

import { CounterUpNumber } from "@/components/features/landing/home/CounterUpNumber";
import { MotionInView } from "@/components/motion/MotionInView";
import { getLandingPublicStats } from "@/services/landing-stats";

export async function StatsSection(): Promise<ReactElement> {
  const stats = await getLandingPublicStats();

  return (
    <MotionInView
      as="section"
      className="border-y border-blue-900/30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 py-14 text-white"
    >
      <div className="public-site-container">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                <span>
                  {s.prefix ?? ""}
                  <CounterUpNumber value={s.value} suffix={s.suffix} />
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-blue-200/90">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionInView>
  );
}

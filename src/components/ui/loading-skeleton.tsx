import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

/** Pulse placeholder block — Atlas flat borders, square corners. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-none bg-[color:var(--color-neutral-soft)]",
        className,
      )}
      aria-hidden
    />
  );
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-3 border border-[color:var(--color-border)] bg-white p-4",
        className,
      )}
      role="status"
      aria-label="Memuat"
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: SkeletonProps & { rows?: number; cols?: number }) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-[color:var(--color-border)] bg-white",
        className,
      )}
      role="status"
      aria-label="Memuat daftar"
    >
      <div className="space-y-0">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-[color:var(--color-border)] px-4 py-3 last:border-0"
          >
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className={cn("h-4 flex-1", j === 0 ? "max-w-[40%]" : "max-w-[20%]")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-3xl space-y-4", className)} role="status" aria-label="Memuat formulir">
      <Skeleton className="h-8 w-48" />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Memuat statistik">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-[color:var(--color-border)] bg-white p-6 space-y-2"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

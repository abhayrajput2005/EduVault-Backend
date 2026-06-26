export function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex gap-2">
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted/60" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted/40" />
        </div>
        <div className="mt-4 h-8 w-2/3 animate-pulse rounded-md bg-muted/60" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded-md bg-muted/40" />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-md bg-muted/50" />
          ))}
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-strong rounded-3xl p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted/60" />
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted/60" />
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: i === 0 ? 6 : 4 }).map((_, j) => (
              <div
                key={j}
                className="h-3 animate-pulse rounded-full bg-muted/40"
                style={{ width: `${60 + ((j * 13) % 35)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="glass-strong space-y-6 rounded-3xl p-8">
      <div className="flex gap-2">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted/60" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted/40" />
      </div>
      <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted/60" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted/40" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-16 animate-pulse rounded-2xl bg-muted/40" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/40" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted/40" />
        ))}
      </div>
    </div>
  );
}

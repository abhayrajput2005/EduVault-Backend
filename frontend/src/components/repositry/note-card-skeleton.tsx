export function NoteCardSkeleton() {
  return (
    <div className="glass relative h-full overflow-hidden rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted/60" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-muted/60" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-muted/40" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted/60" />
        <div className="h-4 w-3/5 animate-pulse rounded-md bg-muted/40" />
      </div>
      <div className="mt-4 h-3 w-28 animate-pulse rounded-full bg-muted/40" />
      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="h-9 animate-pulse rounded-md bg-muted/50" />
        <div className="h-9 animate-pulse rounded-md bg-muted/50" />
        <div className="h-9 animate-pulse rounded-md bg-muted/60" />
      </div>
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.8s_infinite]" />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

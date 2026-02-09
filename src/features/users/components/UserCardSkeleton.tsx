export function UserCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-800 p-6 flex items-center gap-4 animate-pulse shadow-card">
      <div className="w-14 h-14 rounded-full bg-slate-700/80 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded-lg bg-slate-700/80" />
        <div className="h-3 w-1/2 rounded-lg bg-slate-700/80" />
      </div>
    </div>
  )
}

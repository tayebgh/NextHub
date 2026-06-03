// components/cards/website-card-skeleton.tsx
export function WebsiteCardSkeleton() {
  return (
    <div className="flex flex-col p-4 rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl skeleton shrink-0" />
        <div className="flex-1 pt-0.5 space-y-2">
          <div className="h-3.5 rounded skeleton w-3/4" />
          <div className="h-3 rounded skeleton w-1/2" />
        </div>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="h-3 rounded skeleton w-full" />
        <div className="h-3 rounded skeleton w-4/5" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-7 w-16 rounded-lg skeleton" />
        <div className="h-7 w-16 rounded-lg skeleton" />
      </div>
    </div>
  );
}

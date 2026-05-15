export const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-lg bg-slate-200 ${className}`.trim()}
  />
);

export function PageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      <SkeletonBlock className="h-10 w-48" />
      <SkeletonBlock className="h-36 w-full rounded-xl" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="flex w-full flex-col gap-4">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[72px_1fr_auto] gap-4 rounded-xl border border-slate-200 bg-white p-4"
        >
          <SkeletonBlock className="h-16 w-16 rounded-xl" />
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
          <SkeletonBlock className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <SkeletonBlock className="h-40 w-40 rounded-full" />
      <div className="grid w-full max-w-xl gap-5 md:grid-cols-2">
        <SkeletonBlock className="h-8 md:col-span-2" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-16" />
      </div>
      <SkeletonBlock className="h-10 w-32" />
    </div>
  );
}

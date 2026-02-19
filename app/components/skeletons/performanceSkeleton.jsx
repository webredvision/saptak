import { Skeleton } from "@/app/components/ui/skeleton";

export function FundListSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-3 bg-[var(--rv-bg-surface)] rounded-xl border border-[var(--rv-border)]">
      <div className="flex flex-col md:flex-row gap-4 justify-between h-20 items-center bg-[var(--rv-bg-secondary-light)] p-4 rounded-xl shadow-lg border border-[var(--rv-border)]">
        <Skeleton className="h-10 w-full md:w-96 rounded-lg" />
        <Skeleton className="h-10 w-full md:w-48 rounded-lg" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="group bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-[70%] rounded" />{" "}
              {/* Fund name */}
              <Skeleton className="h-4 w-[30%] rounded" />{" "}
              {/* Fund category */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 items-center">
              <div className="space-y-2">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </div>

            <div className="md:ml-4 flex justify-end">
              <Skeleton className="h-10 w-[140px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FundDetailSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 bg-[var(--rv-bg-page)]">
      {/* Left Side - Fund Info & Chart */}
      <div className="flex-1 bg-[var(--rv-bg-surface)] rounded-xl shadow p-6 space-y-6 border border-[var(--rv-border)]">
        {/* Fund Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3 rounded" />{" "}
          {/* Fund Name */}
          <Skeleton className="h-4 w-1/3 rounded" />{" "}
          {/* Fund Type */}
        </div>

        {/* NAV / Corpus / CAGR */}
        <div className="flex gap-8">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 rounded" /> {/* NAV */}
            <Skeleton className="h-4 w-10 rounded" /> {/* Label */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-28 rounded" /> {/* Corpus */}
            <Skeleton className="h-4 w-16 rounded" /> {/* Label */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 rounded" /> {/* CAGR */}
            <Skeleton className="h-4 w-20 rounded" /> {/* Label */}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="w-full h-[250px] rounded-md overflow-hidden bg-[var(--rv-bg-secondary-light)]">
          <Skeleton className="h-full w-full rounded" />
        </div>

        {/* Date Range Buttons */}
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-10 rounded" />
          ))}
        </div>

        {/* Footer Note */}
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>

      {/* Right Side - SIP Calculator */}
      <div className="w-full lg:w-[350px] bg-[var(--rv-bg-surface)] rounded-xl shadow p-6 space-y-4 border border-[var(--rv-border)]">
        <Skeleton className="h-6 w-40 rounded" />{" "}
        {/* SIP Calculator Title */}
        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        {/* Monthly investment slider */}
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        {/* Years slider */}
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        {/* Result Cards */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

export function FundCategorySkeleton() {
  const items = Array.from({ length: 39 });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className="group flex items-center px-4 justify-between rounded-lg bg-[var(--rv-bg-surface)] p-2 border border-[var(--rv-border)]"
        >
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-3">
            <div className="bg-[var(--rv-bg-secondary-light)] rounded-full p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40 rounded" />
          </div>

          {/* Right: Arrow Icon */}
          <div className="p-1 rounded-full bg-[var(--rv-bg-secondary-light)]">
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

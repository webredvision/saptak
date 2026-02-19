"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_ROOT_MARGIN = "200px";

export default function useInfiniteNews(activeData, options = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const resetKey = options.resetKey ?? "";
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, resetKey, activeData?.length]);

  useEffect(() => {
    const total = activeData?.length ?? 0;
    if (!sentinelRef.current || total === 0 || visibleCount >= total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, total));
        }
      },
      { rootMargin }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [activeData?.length, pageSize, rootMargin, visibleCount]);

  const visibleData = useMemo(() => {
    if (!Array.isArray(activeData)) return [];
    return activeData.slice(0, visibleCount);
  }, [activeData, visibleCount]);

  const hasMore = visibleCount < (activeData?.length ?? 0);

  return { visibleData, hasMore, sentinelRef };
}

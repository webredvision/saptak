import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-[var(--rv-secondary-light)]", className)}
      {...props} />)
  );
}

export { Skeleton }


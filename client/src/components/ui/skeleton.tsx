import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border bg-card shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

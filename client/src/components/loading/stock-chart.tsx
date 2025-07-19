import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
      <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
      <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
    </div>
  );
}

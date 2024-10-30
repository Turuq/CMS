import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default async function Loading() {
  return (
    <>
      <div className="flex justify-center gap-4 mb-4">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-36 h-8 rounded-xl" />
      </div>
      <div className="rounded-md flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-40 h-8 rounded-xl" />
            <Skeleton className="w-40 h-8 rounded-xl" />
            <Skeleton className="w-40 h-8 rounded-xl" />
            <Skeleton className="w-40 h-8 rounded-xl" />
          </div>
          <Skeleton className="w-40 h-8 rounded-xl" />
        </div>
        <Separator />
        <Skeleton className="w-60 h-8 rounded-xl" />
        <Skeleton className="w-full h-40 rounded-xl" />
      </div>
    </>
  );
}

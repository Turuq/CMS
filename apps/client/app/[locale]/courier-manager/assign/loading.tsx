import CourierCardSkeleton from "@/components/feedback/courier-card-skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
        <CourierCardSkeleton />
        <CourierCardSkeleton />
        <CourierCardSkeleton />
        <CourierCardSkeleton />
        <CourierCardSkeleton />
        <CourierCardSkeleton />
      </div>
    </div>
  );
}

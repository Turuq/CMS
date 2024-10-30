import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
export default function Loading() {
  return (
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

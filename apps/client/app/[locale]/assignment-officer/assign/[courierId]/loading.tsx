import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return (
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <div className="mb-5">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
      </div>
      <div className="mt-10">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
      </div>
      <div className="flex justify-end mt-10">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

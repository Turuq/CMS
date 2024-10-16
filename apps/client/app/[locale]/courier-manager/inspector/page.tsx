'use client';

import { getAllBatches } from '@/app/actions/batch-actions';
import BatchCardSkeleton from '@/components/feedback/batch-card-skeleton';
import { icons } from '@/components/icons/icons';
import BatchCard from '@/components/inspector/batch-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => await getAllBatches(),
  });
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div className="w-full flex flex-col gap-10">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Courier" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <SelectItem
                key={index}
                value={`Courier ${index + 1}`}
              >{`Courier ${index + 1}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between bg-light dark:bg-dark_border rounded-xl w-80 py-1 px-2 h-10">
          <input
            placeholder="Search by OID"
            className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
            // value={''}
            // onChange={(e) => setOID(e.target.value)}
          />
          <button
            className="hover:text-accent"
            // onClick={() =>
            //   router.push(`/admin/courier/${id}/inspection/current/${OID}`)
            // }
          >
            {icons.search}
          </button>
        </div>
      </div>
      {/* Batch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {isPending ? (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-500">Finished</h3>
              <Skeleton className="w-20 h-5" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <BatchCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-500">Finished</h3>
              <p className="text-xs font-semibold text-dark_border/80 dark:text-light_border/80">
                {data.filter((o) => o.endDate).length} Batches
              </p>
            </div>
            {data &&
              data
                .filter((o) => o.endDate)
                .map((batch) => <BatchCard key={batch.BID} batch={batch} />)}
          </div>
        )}
        {isPending ? (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-500">In Progress</h3>
              <Skeleton className="w-20 h-5" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <BatchCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-500">In Progress</h3>
              <p className="text-xs font-semibold text-dark_border/80 dark:text-light_border/80">
                {data.filter((o) => o.endDate === null).length} Batches
              </p>
            </div>
            {data &&
              data
                .filter((o) => o.endDate === null)
                .map((batch) => <BatchCard key={batch.BID} batch={batch} />)}
          </div>
        )}
      </div>
    </div>
  );
}

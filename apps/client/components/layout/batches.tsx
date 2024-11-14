'use client';

import { getAllBatches } from '@/app/actions/batch-actions';
import { getCouriers } from '@/app/actions/courier-actions';
import BatchCardSkeleton from '@/components/feedback/batch-card-skeleton';
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
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function BatchesLayout({ locale }: { locale: string }) {
  const router = useRouter();

  const tCourier = useTranslations(
    'courierManager.tabs.orders.ordersTable.filters.courier'
  );
  const t = useTranslations('batch');

  const { data, isPending, error } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => await getAllBatches(),
  });

  const {
    data: couriers,
    error: couriersError,
    isPending: couriersPending,
  } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: () => getCouriers(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  function handleValueChange(value: string) {
    router.push(`inspector/${value}`);
  }

  if (error || couriersError) {
    return <p>Error: {error?.message || couriersError?.message}</p>;
  }
  return (
    <div className="w-full flex flex-col gap-10">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="flex items-center justify-between">
        {couriersPending ? (
          <Skeleton className="w-40 h-8 rounded-xl p-2" />
        ) : (
          <Select
            onValueChange={handleValueChange}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <SelectTrigger
              className={`rounded-xl capitalize text-xs font-semibold bg-light dark:bg-dark_border p-2 hover:bg-muted w-40 h-8 border-none`}
            >
              <SelectValue
                className="capitalize"
                placeholder={tCourier('placeholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {couriers?.map((courier, index) => (
                <SelectItem
                  key={index}
                  value={courier._id}
                  className="capitalize"
                >
                  {courier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {/* <div className="flex items-center justify-between bg-light dark:bg-dark_border rounded-xl w-80 py-1 px-2 h-10">
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
        </div> */}
      </div>
      {/* Batch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {isPending ? (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-500">
                {t('titles.finished')}
              </h3>
              <Skeleton className="w-20 h-5" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <BatchCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:p-5 p-2 rounded-xl bg-light/30 dark:bg-dark_border/30">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-500">
                {t('titles.finished')}
              </h3>
              <p className="text-xs font-semibold text-dark_border/80 dark:text-light_border/80">
                {data
                  .filter((o) => o.endDate)
                  .length.toLocaleString(`${locale}-EG`)}{' '}
                {t('titles.batches')}
              </p>
            </div>
            {data &&
              data
                .filter((o) => o.endDate)
                .map((batch) => (
                  <BatchCard key={batch.BID} batch={batch} locale={locale} />
                ))}
          </div>
        )}
        {isPending ? (
          <div className="flex flex-col gap-5 lg:px-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-500">
                {t('titles.inProgress')}
              </h3>
              <Skeleton className="w-20 h-5" />
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <BatchCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:p-5 p-2 rounded-xl bg-light/30 dark:bg-dark_border/30">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-500">
                {t('titles.inProgress')}
              </h3>
              <p className="text-xs font-semibold text-dark_border/80 dark:text-light_border/80">
                {data
                  .filter((o) => o.endDate === null)
                  .length.toLocaleString(`${locale}-EG`)}{' '}
                {t('titles.batches')}
              </p>
            </div>
            {data &&
              data
                .filter((o) => o.endDate === null)
                .map((batch) => (
                  <BatchCard key={batch.BID} batch={batch} locale={locale} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

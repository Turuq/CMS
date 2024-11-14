'use client';

import { getCourierBatches } from '@/app/actions/batch-actions';
import BatchCardSkeleton from '@/components/feedback/batch-card-skeleton';
import BatchCard from '@/components/inspector/batch-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Page({
  params: { courierId, locale },
}: {
  params: { locale: string; courierId: string };
}) {
  const t = useTranslations('batch');

  const {
    error,
    data: batches,
    isPending,
  } = useQuery({
    queryKey: ['courier-batches', courierId],
    queryFn: async () => await getCourierBatches(courierId),
  });

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {batches && (
        <h1 className="text-3xl font-black uppercase">
          {t('titles.courierBatches', { name: batches[0].courier?.name })}
        </h1>
      )}
      {/* Batch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {isPending ? (
          <div className="flex flex-col gap-5 lg:p-5 p-2 rounded-xl bg-light/30 dark:bg-dark_border/30">
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
                {batches
                  .filter((o) => o.endDate)
                  .length.toLocaleString(`${locale}-EG`)}{' '}
                {t('titles.batches')}
              </p>
            </div>
            {batches &&
              batches
                .filter((o) => o.endDate)
                .map((batch) => (
                  <BatchCard
                    key={batch.BID}
                    batch={batch}
                    href={`batch/${batch._id}`}
                  />
                ))}
          </div>
        )}
        {isPending ? (
          <div className="flex flex-col gap-5 lg:p-5 p-2 rounded-xl bg-light/30 dark:bg-dark_border/30">
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
                {batches
                  .filter((o) => o.endDate === null)
                  .length.toLocaleString(`${locale}-EG`)}{' '}
                {t('titles.batches')}
              </p>
            </div>
            {batches &&
              batches
                .filter((o) => o.endDate === null)
                .map((batch) => (
                  <BatchCard
                    key={batch.BID}
                    batch={batch}
                    href={`batch/${batch._id}`}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}

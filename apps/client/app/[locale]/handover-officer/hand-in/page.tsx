'use client';

import CourierCard from '@/components/cards/courier-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { getCouriersOptions } from '@/utils/query-options/courier-options';
import { useQuery } from '@tanstack/react-query';
import { courierManagerIcons } from '../../courier-manager/components/icons/courier-manager-icons';
import { CourierStatisticsIcons } from '../components/icons/courier-statistics-icons';

export default function HandIn({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { data, error, isPending } = useQuery({
    ...getCouriersOptions,
  });

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }

  return (
    <div className="lg:p-2 w-full">
      <h1 className="font-bold text-lg text-foreground">Hand In</h1>
      <p className="text-sm font-semibold text-foreground/50">
        {
          'Please select a courier to inspect and receive reshipped & returned orders.'
        }
      </p>
      {/* <div className="flex items-center justify-end w-full">
        <Link
          href={`hand-in/all/inspection`}
          className="flex items-center w-44 border border-accent/50 bg-transparent hover:bg-accent hover:text-accent-foreground h-8 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          {courierManagerIcons['inspect']}
          <span className="ml-2">Inspection History</span>
        </Link>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
        {isPending ? (
          <div className="w-full col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <CourierCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {data.active.map((courier) => (
              <CourierCard
                key={courier._id}
                courier={courier}
                locale={locale}
                href={`hand-in/inspector/${courier._id}`}
                hrefOptions={{
                  icon: courierManagerIcons['inspect'],
                  tooltip: 'Inspect',
                  label: 'inspect',
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
                  <div className="grid grid-cols-4 w-full h-auto px-5 py-2 rounded-xl bg-muted items-center justify-between">
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['outForDelivery']}
                      <p className="text-xs font-bold">
                        {courier.statistics?.outForDelivery ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['delivered']}
                      <p className="text-xs font-bold">
                        {courier.statistics?.delivered ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['toBeReshipped']}
                      <p className="text-xs font-bold">
                        {courier.statistics?.toBeReshipped ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['collectedAmount']}
                      <p className="text-xs font-bold">
                        {(
                          courier.statistics?.courierCollected ?? 0
                        ).toLocaleString('en-EG', {
                          style: 'currency',
                          currency: 'EGP',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CourierCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

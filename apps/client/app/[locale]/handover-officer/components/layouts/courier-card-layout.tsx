'use client';

import { CourierWithStatistics } from '@/api/validation/courier';
import { api } from '@/app/actions/api';
import CourierCard from '@/components/cards/courier-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CourierStatisticsIcons } from '../icons/courier-statistics-icons';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';

async function getCouriers(): Promise<{
  active: CourierWithStatistics[];
  inactive: CourierWithStatistics[];
}> {
  const res = await api.courier.withStatistics.$get();
  if (!res.ok) {
    toast.error('Failed to get Couriers, please try again later!');
  }
  const data = await res.json();

  return data;
}

export default function CourierCardLayout({
  locale,
  initial,
}: {
  locale: string;
  initial: {
    active: CourierWithStatistics[];
    inactive: CourierWithStatistics[];
  };
}) {
  const { error, data, isPending } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: getCouriers,
    initialData: initial,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto p-5">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourierCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }

  return (
    <div className="mt-5">
      <Tabs defaultValue="active" className={`w-full`}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
            {data.active.map((courier) => (
              <CourierCard
                key={courier._id.toString()}
                courier={courier}
                locale={locale}
                href={`hand-over/${courier._id}`}
                hrefOptions={{
                  tooltip: 'Hand Over',
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
                  <div className="grid grid-cols-4 w-full h-auto px-5 py-2 rounded-xl bg-muted items-center justify-between">
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['outForDelivery']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.outForDelivery ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['delivered']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.delivered ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['toBeReshipped']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.toBeReshipped ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['collectedAmount']}
                      <p className="text-xs font-bold">
                        {(
                          courier.statistics[0]?.courierCollected ?? 0
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
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
            {data.inactive.map((courier) => (
              <CourierCard
                key={courier._id.toString()}
                courier={courier}
                locale={locale}
                href={`hand-over/${courier._id}`}
                hrefOptions={{
                  tooltip: 'Hand Over',
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
                  <div className="grid grid-cols-4 w-full h-auto px-5 py-2 rounded-xl bg-muted items-center justify-between">
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['outForDelivery']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.outForDelivery ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['delivered']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.delivered ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['toBeReshipped']}
                      <p className="text-xs font-bold">
                        {courier.statistics[0]?.toBeReshipped ?? 0}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-1 items-center justify-center">
                      {CourierStatisticsIcons['collectedAmount']}
                      <p className="text-xs font-bold">
                        {(
                          courier.statistics[0]?.courierCollected ?? 0
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
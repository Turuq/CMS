'use client';

import { CourierWithStatistics } from '@/api/validation/courier';
import CourierCard from '@/components/cards/courier-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCouriersOptions } from '@/utils/query-options/courier-options';
import { useQuery } from '@tanstack/react-query';
import { CourierStatisticsIcons } from '../icons/courier-statistics-icons';
import { useTranslations } from 'next-intl';

export default function CourierCardLayout({
  locale,
  initial,
  href,
  hrefOptions,
}: {
  locale: string;
  initial: {
    active: CourierWithStatistics[];
    inactive: CourierWithStatistics[];
  };
  href?: string;
  hrefOptions?: {
    tooltip: string;
    label: string;
  };
}) {
  const t = useTranslations('handoverOfficer.tabs.handOver');

  const { error, data, isPending } = useQuery({
    ...getCouriersOptions,
    initialData: initial,
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
      <Tabs
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        defaultValue="active"
        className={`w-full`}
      >
        <TabsList>
          <TabsTrigger value="active">{t('tabs.active')}</TabsTrigger>
          <TabsTrigger value="inactive">{t('tabs.inactive')}</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
            {data.active.map((courier) => (
              <CourierCard
                key={courier._id.toString()}
                courier={courier}
                locale={locale}
                href={`${href ?? 'hand-over'}/${courier._id}`}
                hrefOptions={
                  hrefOptions ?? {
                    tooltip: 'Hand Over',
                    label: 'handover',
                  }
                }
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
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
            {data.inactive.map((courier) => (
              <CourierCard
                key={courier._id.toString()}
                courier={courier}
                locale={locale}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

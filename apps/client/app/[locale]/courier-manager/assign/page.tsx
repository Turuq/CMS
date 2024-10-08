'use client';

import { getGroupedCouriers } from '@/app/actions/courier-actions';
import CourierCard from '@/components/cards/courier-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('courierManager.tabs.assign');

  const { data, isPending, error } = useQuery({
    queryKey: ['get-grouped-couriers'],
    queryFn: () => getGroupedCouriers(),
  });

  if (isPending) {
    return (
      <div className="p-2">
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
    <div className="w-full bg-light_border dark:bg-dark p-2 rounded-xl">
      <Tabs
        defaultValue="active"
        className="w-full"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList>
          <TabsTrigger value="active">{t('tabs.active')}</TabsTrigger>
          <TabsTrigger value="inactive">{t('tabs.inactive')}</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
            {data &&
              data.active.map((courier) => (
                <CourierCard
                  key={courier._id}
                  courier={courier}
                  href={`/${locale}/courier-manager/assign/${courier._id}`}
                  locale={locale}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
            {data &&
              data.inactive.map((courier) => (
                <CourierCard
                  key={courier._id}
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

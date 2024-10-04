'use client';

import { api } from '@/app/actions/api';
import CourierCard from '@/components/cards/courier-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // const res = await api.courier.grouped.$get();
  // const data = await res.json();

  const { data, isPending, error } = useQuery({
    queryKey: ['get-grouped-couriers'],
    queryFn: async () => {
      const res = await api.courier.grouped.$get();
      if (!res.ok) {
        throw new Error('Failed to get couriers');
      }
      const data = await res.json();
      return data;
    },
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
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
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

'use client';

import { api } from '@/app/actions/api';
import { columns } from '@/components/tables/orders/order-columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { OrdersDataTable } from '@/components/tables/orders/orders-data-table';
import queryClient from '@/lib/query/query-client';
import { useTranslations } from 'next-intl';

async function getOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const res = await api.order.turuq[':page'][':pageSize'].$get({
    param: { page, pageSize },
  });
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

async function getIntegrationOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const res = await api.order.integration[':page'][':pageSize'].$get({
    param: { page, pageSize },
  });
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Translations
  const t = useTranslations('courierManager.tabs.orders');
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch Table Data
  const { data: turuqOrders, error: turuqError } = useQuery({
    queryKey: ['get-orders', page, pageSize],
    queryFn: () =>
      getOrders({ page: page.toString(), pageSize: pageSize.toString() }),
  });

  const { data: integrationOrders, error: integrationError } = useQuery({
    queryKey: ['get-integration-orders', page, pageSize],
    queryFn: () =>
      getIntegrationOrders({
        page: page.toString(),
        pageSize: pageSize.toString(),
      }),
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['get-orders', page + 1, pageSize],
      queryFn: () =>
        getOrders({
          page: (page + 1).toString(),
          pageSize: pageSize.toString(),
        }),
    });
    queryClient.prefetchQuery({
      queryKey: ['get-integration-orders', page + 1, pageSize],
      queryFn: () =>
        getIntegrationOrders({
          page: (page + 1).toString(),
          pageSize: pageSize.toString(),
        }),
    });
  }, [page, pageSize, turuqOrders, integrationOrders]);

  if (turuqError) {
    return <div>An Error Has Occurred: {turuqError.message}</div>;
  }

  if (integrationError) {
    return <div>An Error Has Occurred: {integrationError.message}</div>;
  }

  return (
    <div className="w-full bg-light_border dark:bg-dark p-2 rounded-xl">
      <Tabs
        defaultValue="turuq"
        className="w-full"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList>
          <TabsTrigger className="capitalize" value="turuq">
            {t('tabs.turuq')}
          </TabsTrigger>
          <TabsTrigger className="capitalize" value="integrations">
            {t('tabs.integrations')}
          </TabsTrigger>
          <TabsTrigger className="capitalize" value="imported" disabled>
            {t('tabs.imported')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="turuq" className="w-full">
          <div className="p-5 rounded-xl bg-light dark:bg-dark_border">
            <OrdersDataTable
              locale={locale}
              columns={columns}
              data={turuqOrders?.orders ?? []}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              enableServerFilter
            />
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="p-5 rounded-xl bg-light dark:bg-dark_border">
            <OrdersDataTable
              locale={locale}
              columns={columns}
              data={integrationOrders?.integrationOrders ?? []}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              enableServerFilter
            />
          </div>
        </TabsContent>
        <TabsContent value="imported">Coming Soon!</TabsContent>
      </Tabs>
    </div>
  );
}
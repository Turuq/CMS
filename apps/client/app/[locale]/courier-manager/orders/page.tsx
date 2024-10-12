'use client';

import { FilterObject } from '@/api/utils/validation';
import {
  getIntegrationOrders,
  getTuruqOrders,
} from '@/app/actions/order-actions';
import { columns } from '@/components/tables/orders/order-columns';
import { OrdersDataTable } from '@/components/tables/orders/orders-data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import queryClient from '@/lib/query/query-client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Translations
  const t = useTranslations('courierManager.tabs.orders');
  const [turuqServerColumnFilters, setTuruqServerColumnFilters] =
    useState<FilterObject>({});
  const [integrationServerColumnFilters, setIntegrationServerColumnFilters] =
    useState<FilterObject>({});
  // Pagination
  const [turuqPage, setTuruqPage] = useState<number>(1);
  const [integrationPage, setIntegrationPage] = useState<number>(1);
  const [turuqPageSize, setTuruqPageSize] = useState<number>(10);
  const [integrationPageSize, setIntegrationPageSize] = useState<number>(10);

  // Fetch Table Data
  const {
    data: turuqOrders,
    error: turuqError,
    isPending: turuqPending,
  } = useQuery({
    queryKey: [
      'get-orders',
      turuqPage,
      turuqPageSize,
      turuqServerColumnFilters,
    ],
    queryFn: () =>
      getTuruqOrders({
        page: turuqPage.toString(),
        pageSize: turuqPageSize.toString(),
        conditions: turuqServerColumnFilters,
      }),
  });

  const {
    data: integrationOrders,
    error: integrationError,
    isPending: integrationPending,
  } = useQuery({
    queryKey: [
      'get-integration-orders',
      integrationPage,
      integrationPageSize,
      integrationServerColumnFilters,
    ],
    queryFn: () =>
      getIntegrationOrders({
        page: integrationPage.toString(),
        pageSize: integrationPageSize.toString(),
        conditions: integrationServerColumnFilters,
      }),
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [
        'get-orders',
        turuqPage + 1,
        turuqPageSize,
        turuqServerColumnFilters,
      ],
      queryFn: () =>
        getTuruqOrders({
          page: (turuqPage + 1).toString(),
          pageSize: turuqPageSize.toString(),
          conditions: turuqServerColumnFilters,
        }),
    });
  }, [turuqPage, turuqPageSize, turuqOrders, turuqServerColumnFilters]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [
        'get-integration-orders',
        integrationPage + 1,
        integrationPageSize,
        integrationServerColumnFilters,
      ],
      queryFn: () =>
        getIntegrationOrders({
          page: (integrationPage + 1).toString(),
          pageSize: integrationPageSize.toString(),
          conditions: integrationServerColumnFilters,
        }),
    });
  }, [
    integrationPage,
    integrationPageSize,
    integrationOrders,
    integrationServerColumnFilters,
  ]);

  if (turuqError) {
    return <div>An Error Has Occurred: {turuqError.message}</div>;
  }

  if (integrationError) {
    return <div>An Error Has Occurred: {integrationError.message}</div>;
  }

  return (
    <div className="w-full bg-light_border dark:bg-dark p-2 rounded-xl space-y-5">
      <h1 className="text-3xl font-bold opacity-80">{t('header')}</h1>
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
              page={turuqPage}
              pageSize={turuqPageSize}
              totalPages={turuqOrders?.totalPages ?? 1}
              onPageChange={setTuruqPage}
              onPageSizeChange={setTuruqPageSize}
              enableServerFilter
              serverColumnFilters={turuqServerColumnFilters}
              setServerColumnFilters={setTuruqServerColumnFilters}
              loading={turuqPending}
            />
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="p-5 rounded-xl bg-light dark:bg-dark_border">
            <OrdersDataTable
              locale={locale}
              columns={columns}
              data={integrationOrders?.integrationOrders ?? []}
              page={integrationPage}
              pageSize={integrationPageSize}
              totalPages={integrationOrders?.totalPages ?? 1}
              onPageChange={setIntegrationPage}
              onPageSizeChange={setIntegrationPageSize}
              enableServerFilter
              serverColumnFilters={integrationServerColumnFilters}
              setServerColumnFilters={setIntegrationServerColumnFilters}
              loading={integrationPending}
            />
          </div>
        </TabsContent>
        <TabsContent value="imported">Coming Soon!</TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import {
  checkHasOutstanding,
  endBatch,
  getBatchById,
} from '@/app/actions/batch-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { unassignedSelectedColumns } from '@/components/tables/orders/order-columns';
import { Button } from '@/components/ui/button';
import CourierCard from '@/components/cards/courier-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { icons } from '@/components/icons/icons';
import KpiCard from '@/components/cards/kpi-card';
import moment from 'moment';
import { toast } from 'sonner';
import { ToastStyles } from '@/utils/styles';
import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import BatchPageSkeleton from '@/components/feedback/batch-page-skeleton';
import SelectedOrderTable from '@/app/[locale]/courier-manager/assign/[courierId]/selected-orders-table';

export default function Page({
  params: { batchId, locale },
}: {
  params: { batchId: string; locale: string };
}) {
  const tabs = useTranslations('navigation.orders.tabs');
  const t = useTranslations('batch');

  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: batch,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['batches', batchId],
    queryFn: async () => await getBatchById(batchId),
  });

  const { data: hasOutstanding } = useQuery({
    queryKey: ['hasOutstanding', batchId],
    queryFn: async () => await checkHasOutstanding(batchId),
  });

  async function handleEndBatch() {
    setLoading(true);
    try {
      const res = await endBatch(batchId);
      if (res) {
        toast.success('Batch ended successfully', {
          style: ToastStyles.success,
        });
        setLoading(false);
        refetch();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      toast.error('Failed to end batch', {
        description: error.message,
        style: ToastStyles.error,
      });
    }
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {isPending ? (
        <>
          <BatchPageSkeleton />
        </>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h1 className="uppercase font-black text-3xl text-opacity-80">
              Batch-{batch.BID.toString().padStart(3, '0')}
            </h1>
            <div className="flex items-center gap-3 text-base lg:text-3xl font-black text-opacity-80">
              <h1>{moment(batch.startDate).locale(locale).format('LL')}</h1>
              <span>-</span>
              <h1>
                {batch.endDate
                  ? moment(batch.endDate).locale(locale).format('LL')
                  : 'Current'}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2 w-full">
              <CourierCard courier={batch.courier} locale={locale} />
            </div>

            <div className="col-span-1 lg:col-span-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="col-span-1 lg:col-span-2">
                <KpiCard
                  locale={locale}
                  title="Total Orders"
                  statistic={
                    batch.orders.length + batch.integrationOrders.length
                  }
                  chart
                  chartConfig={{
                    chart: 'tracker',
                    data: [
                      { color: 'emerald', tooltip: 'Delivered' },
                      { color: 'stone', tooltip: 'Out For Delivery' },
                      { color: 'stone', tooltip: 'Out For Delivery' },
                      { color: 'emerald', tooltip: 'Delivered' },
                      { color: 'stone', tooltip: 'Out For Delivery' },
                    ],
                    categories: [],
                    index: '',
                    colors: [],
                  }}
                />
              </div>
              <KpiCard locale={locale} title="Delivered Orders" statistic={2} />
              <KpiCard
                locale={locale}
                title="Total Collected"
                financial
                statistic={1860}
                dotted
                //   date={moment(batch.startDate)}
              />
              <KpiCard locale={locale} title="To Be Reshipped" statistic={1} />
            </div>
          </div>
          {hasOutstanding && !batch.endDate && (
            <Alert className="bg-red-500 dark:bg-red-300 text-light dark:text-dark">
              <div className="flex items-start gap-2">
                <div className="text-inherit">{icons.warning}</div>
                <div className="flex flex-col gap-1">
                  <AlertTitle className="font-bold">
                    {t('outstanding-warn.title')}
                  </AlertTitle>
                  <AlertDescription className="">
                    {t('outstanding-warn.description')}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          <Tabs
            defaultValue="turuq"
            className="w-full"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="turuq">{tabs('turuq')}</TabsTrigger>
                <TabsTrigger value="integrations">
                  {tabs('integrations')}
                </TabsTrigger>
              </TabsList>
              {!batch.endDate && (
                <Button
                  variant={'default'}
                  disabled={hasOutstanding || loading}
                  onClick={handleEndBatch}
                >
                  {loading ? (
                    <Loader2Icon size={16} className="animate-spin" />
                  ) : (
                    'End Batch'
                  )}
                </Button>
              )}
            </div>
            <TabsContent value="turuq">
              <div className="w-full">
                <SelectedOrderTable
                  columns={unassignedSelectedColumns}
                  data={batch.orders}
                  locale={locale}
                />
              </div>
            </TabsContent>
            <TabsContent value="integrations">
              <div className="w-full">
                <SelectedOrderTable
                  columns={unassignedSelectedColumns}
                  data={batch.integrationOrders}
                  locale={locale}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {/* <pre>{JSON.stringify(batch, null, 2)}</pre> */}
    </div>
  );
}

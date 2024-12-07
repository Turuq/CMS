'use client';

import SelectedOrderTable from '@/app/[locale]/courier-manager/assign/[courierId]/selected-orders-table';
import {
  checkHasOutstanding,
  endBatch,
  getBatchById,
} from '@/app/actions/batch-actions';
import CourierCard from '@/components/cards/courier-card';
import KpiCard from '@/components/cards/kpi-card';
import { RadialChart } from '@/components/charts/radial-chart';
import { RadialChartStacked } from '@/components/charts/radial-chart-stacked';
import BatchPageSkeleton from '@/components/feedback/batch-page-skeleton';
import { icons } from '@/components/icons/icons';
import { getUnassignedSelectedColumns } from '@/components/tables/orders/order-columns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getStatusText,
  getStatusTrackerColor,
} from '@/utils/helpers/status-modifier';
import { ToastStyles } from '@/utils/styles';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Batch({
  batchId,
  locale,
}: {
  batchId: string;
  locale: string;
}) {
  const tabs = useTranslations('navigation.orders.tabs');
  const t = useTranslations('batch');
  const tStatus = useTranslations('dashboard.statistics.cards');

  const [loading, setLoading] = useState<boolean>(false);
  const [trackerData, setTrackerData] = useState<
    { color: string; tooltip: string }[]
  >([]);
  const [totalDeliveredChart, setTotalDeliveredChart] = useState<{
    delivered: number;
    other: number;
  }>({ delivered: 0, other: 0 });
  const [totalReshippedChart, setTotalReshippedChart] = useState<{
    reshipped: number;
    other: number;
    totalOrders: number;
  }>({ reshipped: 0, other: 0, totalOrders: 0 });

  const [financeStatistics, setFinanceStatistics] = useState<{
    toBeReceived: number;
    courierCollected: number;
    totalShipping: number;
  }>({
    toBeReceived: 0,
    courierCollected: 0,
    totalShipping: 0,
  });

  const [orderStatistics, setOrderStatistics] = useState<{
    outForDelivery: number;
    delivered: number;
    toBeReshipped: number;
    cancelled: number;
    paidShippingOnly: number;
    unreachable: number;
  }>({
    outForDelivery: 0,
    delivered: 0,
    toBeReshipped: 0,
    cancelled: 0,
    paidShippingOnly: 0,
    unreachable: 0,
  });

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

  useEffect(() => {
    if (batch) {
      const orders = [...batch.orders, ...batch.integrationOrders];
      const statuses = orders.map((order) => order.status);
      const tracker = statuses.map((status) => {
        return {
          color: getStatusTrackerColor(status),
          tooltip: locale === 'en' ? getStatusText(status) : tStatus(status),
        };
      });
      setTrackerData(tracker);

      const delivered = statuses.filter(
        (status) => status === 'delivered'
      ).length;
      setTotalDeliveredChart({ delivered, other: orders.length - delivered });

      const reshipped = orders.filter((order) => order.reshipped).length;
      const reshippedPercentage = (reshipped / orders.length) * 100;
      setTotalReshippedChart({
        reshipped: reshippedPercentage,
        other: 100 - reshippedPercentage,
        totalOrders: orders.length,
      });

      const finance = orders.reduce(
        (acc, order) => {
          return {
            toBeReceived: acc.toBeReceived + order.total,
            courierCollected: acc.courierCollected + order.courierCOD,
            totalShipping: acc.totalShipping + order.shippingFees,
          };
        },
        { toBeReceived: 0, courierCollected: 0, totalShipping: 0 }
      );
      setFinanceStatistics(finance);

      const statistics = orders.reduce(
        (acc, order) => {
          return {
            outForDelivery:
              acc.outForDelivery + (order.status === 'outForDelivery' ? 1 : 0),
            delivered: acc.delivered + (order.status === 'delivered' ? 1 : 0),
            toBeReshipped: acc.toBeReshipped + (order.toBeReshipped ? 1 : 0),
            cancelled: acc.cancelled + (order.status === 'cancelled' ? 1 : 0),
            paidShippingOnly:
              acc.paidShippingOnly +
              (order.paymentMethod === 'PAID_SHIPPING' ? 1 : 0),
            unreachable:
              acc.unreachable + (order.status === 'unreachable' ? 1 : 0),
          };
        },
        {
          outForDelivery: 0,
          delivered: 0,
          toBeReshipped: 0,
          cancelled: 0,
          paidShippingOnly: 0,
          unreachable: 0,
        }
      );
      setOrderStatistics(statistics);
    }
  }, [batch, locale, tStatus]);

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
              {t('details.batchNum', {
                id: batch.BID.toString().padStart(3, '0'),
              })}
            </h1>
            <div className="flex items-center gap-3 text-base lg:text-3xl font-black text-opacity-80">
              <h1>{moment(batch.startDate).locale(locale).format('LL')}</h1>
              <span>-</span>
              <h1>
                {batch.endDate
                  ? moment(batch.endDate).locale(locale).format('LL')
                  : t('details.current')}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="col-span-1 lg:col-span-1 flex items-center justify-center w-full">
              <CourierCard courier={batch.courier} locale={locale} />
            </div>
            <div className="col-span-1 flex items-center justify-center w-full">
              <RadialChartStacked
                chartData={totalDeliveredChart}
                title={t('statistics.completedDeliveries')}
                locale={locale}
                chartConfig={{
                  delivered: {
                    label: t('statistics.charts.tooltip.delivered'),
                    color: 'hsl(var(--accent))',
                  },
                  other: {
                    label: t('statistics.charts.tooltip.other'),
                    color: 'hsl(var(--muted))',
                  },
                }}
              />
            </div>
            <div className="col-span-1 flex items-center justify-center w-full">
              <RadialChart
                chartData={totalReshippedChart}
                title={t('statistics.reshippedRate')}
                locale={locale}
                chartConfig={{
                  reshipped: {
                    label: t('statistics.charts.tooltip.reshipped'),
                    color: 'hsl(var(--accent))',
                  },
                  other: {
                    label: t('statistics.charts.tooltip.other'),
                    color: 'hsl(var(--muted))',
                  },
                }}
              />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <KpiCard
                locale={locale}
                title={t('statistics.totalOrders')}
                statistic={batch.orders.length + batch.integrationOrders.length}
                chart
                chartConfig={{
                  chart: 'tracker',
                  data: trackerData,
                  categories: [],
                  index: '',
                  colors: [],
                }}
              />
            </div>
            <div className="col-span-1 lg:col-span-5 grid grid-cols-1 lg:grid-cols-6 gap-5">
              <KpiCard
                locale={locale}
                title={tStatus('outForDelivery')}
                statistic={orderStatistics.outForDelivery}
              />
              <KpiCard
                locale={locale}
                title={tStatus('delivered')}
                statistic={orderStatistics.delivered}
              />
              <KpiCard
                locale={locale}
                title={tStatus('toBeReshipped')}
                statistic={orderStatistics.toBeReshipped}
              />
              <KpiCard
                locale={locale}
                title={tStatus('cancelled')}
                statistic={orderStatistics.cancelled}
                color="error"
              />
              <KpiCard
                locale={locale}
                title={tStatus('paidShippingOnly')}
                statistic={orderStatistics.paidShippingOnly}
              />
              <KpiCard
                locale={locale}
                title={tStatus('unreachable')}
                statistic={orderStatistics.unreachable}
              />
              <div className="col-span-1 lg:col-span-2">
                <KpiCard
                  locale={locale}
                  title={t('statistics.toBeReceivedTotal')}
                  financial
                  statistic={financeStatistics.toBeReceived}
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <KpiCard
                  locale={locale}
                  title={t('statistics.courierCollectedAmount')}
                  financial
                  statistic={financeStatistics.courierCollected}
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <KpiCard
                  locale={locale}
                  title={t('statistics.totalShippingCollected')}
                  financial
                  statistic={financeStatistics.totalShipping}
                />
              </div>
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
                    <span>{t('buttons.end')}</span>
                  )}
                </Button>
              )}
            </div>
            <TabsContent value="turuq">
              <div className="w-full bg-light dark:bg-dark_border rounded-xl p-5">
                <SelectedOrderTable
                  columns={getUnassignedSelectedColumns(locale)}
                  data={batch.orders}
                  locale={locale}
                  isStatic={true}
                  handleRemoveOrder={() => {}}
                />
              </div>
            </TabsContent>
            <TabsContent value="integrations">
              <div className="w-full bg-light dark:bg-dark_border rounded-xl p-5">
                <SelectedOrderTable
                  columns={getUnassignedSelectedColumns(locale)}
                  data={batch.integrationOrders}
                  locale={locale}
                  isStatic={true}
                  handleRemoveOrder={() => {}}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

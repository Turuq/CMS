'use client';
import KpiCard from '@/components/cards/kpi-card';
import { ordersStatistics } from '@/utils/data/dummy';
import { useTranslations } from 'next-intl';

export default function CourierManagerHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('dashboard.statistics');
  return (
    <main className="flex min-h-screen flex-col gap-5">
      <h1 className="text-3xl font-bold opacity-80">{t('title')}</h1>
      <div className="col-span-12 grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          <KpiCard
            title={t('cards.totalOrders')}
            statistic={ordersStatistics.totalOrders}
            color="accent"
            dotted
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <KpiCard
            title={t('cards.delivered')}
            statistic={ordersStatistics.delivered}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <KpiCard
            title={t('cards.processing')}
            statistic={ordersStatistics.processing}
            color="warning"
            dotted
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.collected')}
            statistic={ordersStatistics.collected}
            color="accent"
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.returned')}
            statistic={ordersStatistics.returned}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.outForDelivery')}
            statistic={ordersStatistics.outForDelivery}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.pending')}
            statistic={ordersStatistics.pending}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.cancelled')}
            statistic={ordersStatistics.cancelled}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.outOfStock')}
            statistic={ordersStatistics.outOfStock}
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KpiCard
            title={t('cards.unreachable')}
            statistic={ordersStatistics.unreachable}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 order-2">
          <KpiCard
            title={t('cards.invalidAddress')}
            statistic={ordersStatistics.invalidAddress}
            color="error"
            dotted
          />
        </div>
        <div className="col-span-6 lg:col-span-4 order-2 lg:order-3">
          <KpiCard
            title={t('cards.postponed')}
            statistic={ordersStatistics.postponed}
          />
        </div>
      </div>
    </main>
  );
}

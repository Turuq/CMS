'use client';
import KpiCard from '@/components/cards/kpi-card';
import { useDictionary } from '@/providers/dictionary-provider';
import { ordersStatistics } from '@/utils/data/dummy';

export default function CourierManagerHome() {
  const { dictionary } = useDictionary();
  const header =
    dictionary['courierManager']['tabs']['home']['orderStatistics']['header'];
  const titles =
    dictionary['courierManager']['tabs']['home']['orderStatistics']['cards'];
  console.log('titles', titles);
  return (
    <main className="flex min-h-screen flex-col gap-5">
      <h1 className="text-3xl font-bold opacity-80">{header}</h1>
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
        <KpiCard
          title={`${titles.totalOrders}`}
          statistic={ordersStatistics.totalOrders}
          color="accent"
          dotted
        />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <KpiCard
          title={`${titles.delivered}`}
          statistic={ordersStatistics.delivered}
        />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <KpiCard
          title={`${titles.processing}`}
          statistic={ordersStatistics.processing}
          color="warning"
          dotted
        />
      </div>
      <div className="col-span-12 grid grid-cols-12 gap-5">
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.collected}`}
            statistic={ordersStatistics.collected}
            color="accent"
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.returned}`}
            statistic={ordersStatistics.returned}
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.outForDelivery}`}
            statistic={ordersStatistics.outForDelivery}
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.pending}`}
            statistic={ordersStatistics.pending}
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.cancelled}`}
            statistic={ordersStatistics.cancelled}
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <KpiCard
            title={`${titles.outOfStock}`}
            statistic={ordersStatistics.outOfStock}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KpiCard
            title={`${titles.unreachable}`}
            statistic={ordersStatistics.unreachable}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 order-2">
          <KpiCard
            title={`${titles.invalidAddress}`}
            statistic={ordersStatistics.invalidAddress}
            color="error"
            dotted
          />
        </div>
        <div className="col-span-6 lg:col-span-3 order-2 lg:order-3">
          <KpiCard
            title={`${titles.postponed}`}
            statistic={ordersStatistics.postponed}
          />
        </div>
      </div>
    </main>
  );
}

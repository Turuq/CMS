import { getTranslations } from 'next-intl/server';
import KpiCard from '../cards/kpi-card';
import type { OrderStatistics } from '@/utils/data/dummy';
import moment from 'moment';
import { GovernorateRadarChart } from '@/components/charts/governorate-radar';
import { api } from '@/app/actions/api';
import { StepChart } from '../charts/step-chart';

export default async function Dashboard({ locale }: { locale: string }) {
  const tKpi = await getTranslations('dashboard.statistics');
  const tChart = await getTranslations('assignmentOfficer.tabs.home');

  const res = await api.batch.dashboard.governorate.$get();
  const data = await res.json();

  const deliveredCouriersRes = await api.batch.dashboard.orders.$get();
  const deliveredCouriers = await deliveredCouriersRes.json();

  const dashRes = await api.batch.dashboard.$get();
  const dashData: OrderStatistics[] = await dashRes.json();

  return (
    <main className="flex min-h-screen flex-col gap-5">
      <h1 className="text-3xl font-bold opacity-80">{tKpi('title')}</h1>

      <div className="grid grid-cols-3 items-center gap-5">
        <div className="col-span-3 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={tKpi('cards.totalOrders')}
            statistic={dashData[0].totalOrders}
            dotted
            link="courier-manager/orders"
          />
        </div>
        <div className="col-span-3 lg:col-span-2 grid grid-cols-3 gap-5">
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.outForDelivery')}
              statistic={dashData[0].outForDelivery}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.toBeReshipped')}
              statistic={dashData[0].toBeReshipped}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.delivered')}
              statistic={dashData[0].delivered}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.totalShippingFees')}
              statistic={dashData[0].totalShippingFees}
              financial
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.totalToBeReceived')}
              statistic={dashData[0].totalToBeReceived}
              financial
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={tKpi('cards.numberOfCouriers')}
              statistic={dashData[0].activeBatches}
              date={moment()}
            />
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={tKpi('cards.processingAssigned')}
            statistic={ordersStatistics.processingAssigned}
            link="courier-manager/inspection"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={tKpi('cards.processingUnassigned')}
            statistic={ordersStatistics.processingUnassigned}
            link="courier-manager/assign"
          />
        </div>
      </div> */}
      <div className="grid grid-cols-3 gap-5">
        <GovernorateRadarChart
          title={tChart('outForDeliveryOrdersStatistics.header')}
          description="Showing Out For Delivery orders by governorate"
          chartData={data}
        />
        <div className="col-span-2">
          <StepChart
            chartData={deliveredCouriers}
            title="Delivered Orders"
            description="Showing Top 10 couriers with the most delivered orders"
            chartConfig={{
              delivered: {
                label: 'Delivered',
                color: 'hsl(var(--accent))',
              },
              outForDelivery: {
                label: 'Out For Delivery',
                color: 'hsl(var(--chart-4))',
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}

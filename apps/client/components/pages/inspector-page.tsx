import CourierCard from '@/components/cards/courier-card';
import KpiCard from '@/components/cards/kpi-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { Orders } from '@/components/tables/orders/data';
import OrdersTable from '@/components/tables/orders/fetch-orders';
import { Couriers } from '@/utils/data/dummy';
import moment from 'moment';
import DetailedOrderCard from '../cards/detailed-order';

export default function Inspector({
  locale,
  courierId,
  date,
}: {
  locale: string;
  courierId: string;
  date: string;
}) {
  const courier = Couriers.find((courier) => courier._id === courierId);
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="grid grid-cols-3 gap-5 w-full">
        <div className="col-span-3 lg:col-span-1 w-full flex items-center">
          {!courier ? (
            <CourierCardSkeleton />
          ) : (
            <CourierCard courier={courier} locale={locale} />
          )}
        </div>
        <div className="col-span-3 lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <KpiCard title="out for delivery" statistic={60} color="accent" />
          <div className="hidden lg:block">
            <KpiCard title="delivered" statistic={28} color="muted" />
          </div>
          <KpiCard title="to be reshipped" statistic={14} color="muted" />
          <div className="hidden lg:block">
            <KpiCard title="cancelled" statistic={8} color="muted" />
          </div>
          <div className="hidden lg:block">
            <KpiCard title="unreachable" statistic={10} color="muted" />
          </div>
          <KpiCard title="paid shipping only" statistic={0} color="muted" />
        </div>
        <div className="col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <KpiCard
            title="to be received total"
            statistic={0}
            financial
            color="muted"
            dotted
          />
          <KpiCard
            title="courier collected amount"
            statistic={0}
            financial
            color="muted"
            dotted
          />
          <KpiCard
            title="total shipping fee collected"
            statistic={0}
            financial
            color="muted"
            dotted
          />
        </div>
        <div className="col-span-3 flex flex-col gap-1">
          <h1 className="font-bold text-lg text-foreground">Orders</h1>
          <p className="text-sm font-semibold text-foreground/50 text-balance">
            Assigned Orders on {moment(date).format('LL')}
          </p>
        </div>
        <div className="col-span-2 w-full">
          <OrdersTable orders={Orders} />
        </div>
        <div className="col-span-1 w-full">
          <DetailedOrderCard />
        </div>
      </div>
    </div>
  );
}

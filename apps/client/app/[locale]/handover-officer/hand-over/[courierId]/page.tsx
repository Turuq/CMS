import { api } from '@/app/actions/api';
import CourierCard from '@/components/cards/courier-card';
import KpiCard from '@/components/cards/kpi-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import { icons } from '@/components/icons/icons';
import OrdersTable from '@/components/tables/orders/fetch-orders';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default async function Page({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const res = await api.courier[':id'].$get({ param: { id: courierId } });
  const courier = await res.json();

  const resTable = await api.order.integration.assigned[':id'].$get({
    param: { id: courierId },
  }); //Processing Orders Assigned to Courier
  const orders = await resTable.json();

  return (
    <div className="flex flex-col gap-5 w-full">
      {courierId === '668fc4297c79e0e333f310e3' && (
        <Alert className="bg-amber-500 dark:bg-amber-300 text-light dark:text-dark">
          <div className="flex items-start gap-2">
            <div className="text-inherit">{icons.info}</div>
            <div className="flex flex-col gap-1">
              <AlertTitle className="font-bold">Heads up!</AlertTitle>
              <AlertDescription className="">
                This courier is currently delivering a batch, Please check back
                later!.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
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
          <h1 className="font-bold text-lg text-foreground">Assigned Orders</h1>
          <p className="text-sm font-semibold text-foreground/50 text-balance">
            Processing Orders Assigned to{' '}
            <span className="capitalize font-bold text-accent">
              {courier?.name}
            </span>
          </p>
        </div>
        <div className="col-span-3 w-full">
          <OrdersTable orders={orders} />
        </div>
        {courierId !== '668fc4297c79e0e333f310e3' && (
          <>
            <div className="col-span-3 flex flex-col gap-1">
              <h1 className="font-bold text-lg text-foreground">
                Handed Orders
              </h1>
              <p className="text-sm font-semibold text-foreground/50 text-balance">
                Orders Handed to{' '}
                <span className="capitalize font-bold text-accent">
                  {courier?.name}{' '}
                </span>
                and are Out For Delivery
              </p>
            </div>
            <div className="col-span-3 w-full">
              <OrdersTable />
            </div>
          </>
        )}
      </div>
      {courierId !== '668fc4297c79e0e333f310e3' && (
        <div className="flex items-center justify-end mb-10">
          <Button variant={'default'}>Complete Handover</Button>
        </div>
      )}
    </div>
  );
}

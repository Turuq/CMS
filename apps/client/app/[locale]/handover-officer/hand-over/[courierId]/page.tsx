'use client';

import SelectedOrderTable from '@/app/[locale]/courier-manager/assign/[courierId]/selected-orders-table';
import { hasActiveBatch, startBatch } from '@/app/actions/batch-actions';
import { getCourierById } from '@/app/actions/courier-actions';
import {
  getCourierAssignedIntegrationOrders,
  getCourierAssignedOrders,
} from '@/app/actions/order-actions';
import CourierCard from '@/components/cards/courier-card';
import KpiCard from '@/components/cards/kpi-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { icons } from '@/components/icons/icons';
import {
  unassignedColumns,
  unassignedSelectedColumns,
} from '@/components/tables/orders/order-columns';
import { SelectableOrdersDataTable } from '@/components/tables/orders/selectable-data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToastStyles } from '@/utils/styles';
import { OrderType } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import { RowSelectionState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import queryClient from '@/lib/query/query-client';
import { Loader2Icon } from 'lucide-react';

export default function Page({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const t = useTranslations('batch');
  const tabs = useTranslations('navigation.orders.tabs');
  const [loading, setLoading] = useState<boolean>(false);

  const [turuqPage, setTuruqPage] = useState<number>(1);
  const [turuqPageSize, setTuruqPageSize] = useState<number>(10);

  const [integrationPage, setIntegrationPage] = useState<number>(1);
  const [integrationPageSize, setIntegrationPageSize] = useState<number>(10);

  const [selectedOrders, setSelectedOrders] = useState<OrderType[]>([]);
  const [selectedIntegrationOrders, setSelectedIntegrationOrders] = useState<
    OrderType[]
  >([]);

  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({});
  const [rowSelectionIntegration, onRowSelectionIntegrationChange] =
    useState<RowSelectionState>({});

  const { data: courier, isPending } = useQuery({
    queryKey: ['get-courier', courierId],
    queryFn: () => getCourierById({ id: courierId }),
  });

  const { data: hasActive, refetch } = useQuery({
    queryKey: ['has-active-batch', courierId],
    queryFn: () => hasActiveBatch({ id: courierId }),
  });

  const {
    data: orders,
    isPending: isOrdersPending,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [
      'get-courier-assigned-orders',
      courierId,
      turuqPage,
      turuqPageSize,
    ],
    queryFn: () =>
      getCourierAssignedOrders({
        id: courierId,
        page: turuqPage.toString(),
        pageSize: turuqPageSize.toString(),
      }),
  });

  const {
    data: integrationOrders,
    isPending: isIntegrationOrdersPending,
    refetch: refetchIntegrationOrders,
  } = useQuery({
    queryKey: [
      'get-courier-assigned-integration-orders',
      courierId,
      integrationPage,
      integrationPageSize,
    ],
    queryFn: () =>
      getCourierAssignedIntegrationOrders({
        id: courierId,
        page: integrationPage.toString(),
        pageSize: integrationPageSize.toString(),
      }),
  });

  async function handleStartBatch() {
    setLoading(true);
    const ids = Object.keys(rowSelection) ?? [];
    const integrationIds = Object.keys(rowSelectionIntegration) ?? [];
    startBatch({ courierId, orderIds: ids, integrationIds })
      .then(() => {
        toast.success('Batch Started Successfully', {
          style: ToastStyles.success,
        });
        setSelectedOrders([]);
        setSelectedIntegrationOrders([]);
        onRowSelectionChange({});
        onRowSelectionIntegrationChange({});
        refetch();
        refetchOrders();
        refetchIntegrationOrders();
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Couldn't Start Batch", {
          style: ToastStyles.error,
        });
        setLoading(false);
        console.error(err);
      });
  }

  useEffect(() => {
    if (orders) {
      const selectedIds = Object.keys(rowSelection);
      if (selectedIds.length > 0) {
        const selected = orders.orders.filter((order) =>
          selectedIds.includes(order._id.toString())
        );
        setSelectedOrders(selected);
      } else {
        setSelectedOrders([]);
      }
    }
  }, [rowSelection, orders]);

  useEffect(() => {
    if (integrationOrders) {
      const selectedIds = Object.keys(rowSelectionIntegration);
      if (selectedIds.length > 0) {
        const selected = integrationOrders.integrationOrders.filter((order) =>
          selectedIds.includes(order._id.toString())
        );
        setSelectedIntegrationOrders(selected);
      } else {
        setSelectedIntegrationOrders([]);
      }
    }
  }, [rowSelectionIntegration, integrationOrders]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [
        'get-courier-assigned-orders',
        courierId,
        turuqPage + 1,
        turuqPageSize,
      ],
      queryFn: () =>
        getCourierAssignedOrders({
          id: courierId,
          page: turuqPage.toString(),
          pageSize: turuqPageSize.toString(),
        }),
      staleTime: 1000 * 60, // 1 minute
    });
  }, [turuqPage, turuqPageSize, orders, courierId]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [
        'get-courier-assigned-integration-orders',
        courierId,
        integrationPage + 1,
        integrationPageSize,
      ],
      queryFn: () =>
        getCourierAssignedIntegrationOrders({
          id: courierId,
          page: integrationPage.toString(),
          pageSize: integrationPageSize.toString(),
        }),
      staleTime: 1000 * 60, // 1 minute
    });
  }, [integrationPage, integrationPageSize, integrationOrders, courierId]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {hasActive && (
        <Alert className="bg-red-500 dark:bg-red-300 text-light dark:text-dark">
          <div className="flex items-start gap-2">
            <div className="text-inherit">{icons.warning}</div>
            <div className="flex flex-col gap-1">
              <AlertTitle className="font-bold">
                {t('warning.title')}
              </AlertTitle>
              <AlertDescription className="">
                {t('warning.description')}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      {courier && (
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="col-span-3 lg:col-span-1 w-full flex items-center">
            {isPending ? (
              <CourierCardSkeleton />
            ) : (
              <CourierCard courier={courier} locale={locale} />
            )}
          </div>
          <div className="col-span-3 lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <KpiCard
              locale={locale}
              title="out for delivery"
              statistic={60}
              color="accent"
            />
            <div className="hidden lg:block">
              <KpiCard
                locale={locale}
                title="delivered"
                statistic={28}
                color="muted"
              />
            </div>
            <KpiCard
              locale={locale}
              title="to be reshipped"
              statistic={14}
              color="muted"
            />
            <div className="hidden lg:block">
              <KpiCard
                locale={locale}
                title="cancelled"
                statistic={8}
                color="muted"
              />
            </div>
            <div className="hidden lg:block">
              <KpiCard
                locale={locale}
                title="unreachable"
                statistic={10}
                color="muted"
              />
            </div>
            <KpiCard
              locale={locale}
              title="paid shipping only"
              statistic={0}
              color="muted"
            />
          </div>
          <div className="col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <KpiCard
              locale={locale}
              title="to be received total"
              statistic={0}
              financial
              color="muted"
              dotted
            />
            <KpiCard
              locale={locale}
              title="courier collected amount"
              statistic={0}
              financial
              color="muted"
              dotted
            />
            <KpiCard
              locale={locale}
              title="total shipping fee collected"
              statistic={0}
              financial
              color="muted"
              dotted
            />
          </div>

          {/* 
        {courierId !== '668fc4297c79e0e333f310e3' && (
          <>
            
            <div className="col-span-3 w-full">
              <OrdersTable />
            </div>
          </>
        )} */}
        </div>
      )}
      <Tabs
        defaultValue="turuq"
        className="w-full"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList>
          <TabsTrigger value="turuq">{tabs('turuq')}</TabsTrigger>
          <TabsTrigger value="integrations">{tabs('integrations')}</TabsTrigger>
        </TabsList>
        <TabsContent value="turuq">
          {isOrdersPending ? (
            <>
              <TableSkeleton />
            </>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-lg text-foreground">
                  Assigned Orders
                </h1>
                <p className="text-sm font-semibold text-foreground/50 text-balance">
                  Processing Orders Assigned to{' '}
                  <span className="capitalize font-bold text-accent">
                    {courier?.name}
                  </span>
                </p>
              </div>
              <div className="w-full">
                <SelectableOrdersDataTable
                  columns={unassignedColumns}
                  data={orders?.orders ?? []}
                  locale={locale}
                  page={turuqPage}
                  onPageChange={setTuruqPage}
                  pageSize={turuqPageSize}
                  onPageSizeChange={setTuruqPageSize}
                  enableRowSelection
                  rowSelection={rowSelection}
                  onRowSelectionChange={onRowSelectionChange}
                  totalPages={orders?.totalPages ?? 1}
                />
              </div>
              <div className="w-full flex flex-col gap-1">
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
              <div className="w-full">
                <SelectedOrderTable
                  columns={unassignedSelectedColumns}
                  data={selectedOrders}
                  locale={locale}
                />
              </div>
              <div className="flex items-center justify-end w-full">
                <Button
                  variant="default"
                  className="w-40"
                  onClick={handleStartBatch}
                  disabled={
                    (Object.keys(rowSelection).length === 0 &&
                      Object.keys(rowSelectionIntegration).length === 0) ||
                    loading ||
                    hasActive
                  }
                >
                  {loading ? (
                    <Loader2Icon size={16} className="animate-spin" />
                  ) : (
                    t('buttons.start')
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="integrations">
          {isIntegrationOrdersPending ? (
            <>
              <TableSkeleton />
            </>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-lg text-foreground">
                  Assigned Orders
                </h1>
                <p className="text-sm font-semibold text-foreground/50 text-balance">
                  Processing Orders Assigned to{' '}
                  <span className="capitalize font-bold text-accent">
                    {courier?.name}
                  </span>
                </p>
              </div>
              <div className="w-full">
                <SelectableOrdersDataTable
                  columns={unassignedColumns}
                  data={integrationOrders?.integrationOrders ?? []}
                  locale={locale}
                  page={integrationPage}
                  onPageChange={setIntegrationPage}
                  pageSize={integrationPageSize}
                  onPageSizeChange={setIntegrationPageSize}
                  enableRowSelection
                  rowSelection={rowSelectionIntegration}
                  onRowSelectionChange={onRowSelectionIntegrationChange}
                  totalPages={integrationOrders?.totalPages ?? 1}
                />
              </div>
              <div className="w-full flex flex-col gap-1">
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
              <div className="w-full">
                <SelectedOrderTable
                  columns={unassignedSelectedColumns}
                  data={selectedIntegrationOrders}
                  locale={locale}
                />
              </div>
              <div className="flex items-center justify-end w-full">
                <Button
                  variant="default"
                  className="w-40"
                  onClick={handleStartBatch}
                  disabled={
                    (Object.keys(rowSelection).length === 0 &&
                      Object.keys(rowSelectionIntegration).length === 0) ||
                    loading ||
                    hasActive
                  }
                >
                  {loading ? (
                    <Loader2Icon size={16} className="animate-spin" />
                  ) : (
                    t('buttons.start')
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* {courierId !== '668fc4297c79e0e333f310e3' && (
        <div className="flex items-center justify-end mb-10">
          <Button variant={'default'}>Complete Handover</Button>
        </div>
      )} */}
    </div>
  );
}

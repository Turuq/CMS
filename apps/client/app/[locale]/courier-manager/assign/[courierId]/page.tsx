'use client';

import { api } from '@/app/actions/api';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  unassignedColumns,
  unassignedSelectedColumns,
} from '@/components/tables/orders/order-columns';

import { OrderType } from '@/types/order';
import queryClient from '@/lib/query/query-client';
import { RowSelectionState } from '@tanstack/react-table';
import SelectedOrderTable from './selected-orders-table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { SelectableOrdersDataTable } from '@/components/tables/orders/selectable-data-table';
import { useTranslations } from 'next-intl';

async function getProcessingTuruqOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const res = await api.order.turuq.processing.unassigned[':page'][
    ':pageSize'
  ].$get({ param: { page: page, pageSize: pageSize } });
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

async function getProcessingIntegrationOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const res = await api.order.integration.processing.unassigned[':page'][
    ':pageSize'
  ].$get({ param: { page: page, pageSize: pageSize } });
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export default function Page({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const t = useTranslations('courierManager.tabs');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedOrders, setSelectedOrders] = useState<OrderType[]>();
  const [selectedIntegrationOrders, setSelectedIntegrationOrders] =
    useState<OrderType[]>();

  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({});
  const [integrationRowSelection, onIntegrationRowSelectionChange] =
    useState<RowSelectionState>({});

  const {
    isPending: isLoadingTuruqOrders,
    data: turuqOrders,
    error: turuqError,
  } = useQuery({
    queryKey: ['get-processing-unassigned-turuq-orders', page, pageSize],
    queryFn: () =>
      getProcessingTuruqOrders({
        page: page.toString(),
        pageSize: pageSize.toString(),
      }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // refetchInterval: 1000 * 60 * 5,
  });

  const {
    isPending: isLoadingIntegrationOrders,
    data: integrationOrders,
    error: integrationError,
  } = useQuery({
    queryKey: ['get-processing-unassigned-integration-orders', page, pageSize],
    queryFn: () =>
      getProcessingIntegrationOrders({
        page: page.toString(),
        pageSize: pageSize.toString(),
      }),

    // staleTime: 1000 * 60 * 5, // 5 minutes
    // refetchInterval: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (turuqOrders) {
      const selectedIds = Object.keys(rowSelection);
      if (selectedIds.length > 0) {
        const selected = turuqOrders.orders.filter((order) =>
          selectedIds.includes(order._id.toString())
        );
        setSelectedOrders(selected);
      } else {
        setSelectedOrders([]);
      }
    }
  }, [rowSelection, turuqOrders]);

  useEffect(() => {
    if (integrationOrders) {
      const selectedIds = Object.keys(integrationRowSelection);
      if (selectedIds.length > 0) {
        const selected = integrationOrders.integrationOrders.filter((order) =>
          selectedIds.includes(order._id.toString())
        );
        setSelectedIntegrationOrders(selected);
      } else {
        setSelectedIntegrationOrders([]);
      }
    }
  }, [integrationRowSelection, integrationOrders]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['get-processing-unassigned-turuq-orders', page + 1, pageSize],
      queryFn: () =>
        getProcessingTuruqOrders({
          page: page.toString(),
          pageSize: pageSize.toString(),
        }),
    });

    queryClient.prefetchQuery({
      queryKey: [
        'get-processing-unassigned-integration-orders',
        page + 1,
        pageSize,
      ],
      queryFn: () =>
        getProcessingIntegrationOrders({
          page: page.toString(),
          pageSize: pageSize.toString(),
        }),
    });
  }, [page, pageSize, turuqOrders, integrationOrders]);

  const { isPending: isPendingTuruq, mutate: assignTuruqOrders } = useMutation({
    mutationKey: ['assign-orders'],
    mutationFn: handleAssignOrders,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['get-processing-unassigned-turuq-orders', page, pageSize],
    //   });
    //   queryClient.refetchQueries({
    //     queryKey: ['get-processing-unassigned-turuq-orders', page, pageSize],
    //   });
    // },
  });

  const { isPending: isPendingIntegrations, mutate: assignIntegrationOrders } =
    useMutation({
      mutationKey: ['assign-integration-orders'],
      mutationFn: handleAssignIntegrationOrders,
      // onSuccess: () => {
      //   queryClient.refetchQueries({
      //     queryKey: [
      //       'get-processing-unassigned-integration-orders',
      //       page,
      //       pageSize,
      //     ],
      //   });
      // },
    });

  async function handleAssignOrders() {
    const ids = Object.keys(rowSelection);
    const res = await api.order.turuq.assign[':id'].$put({
      param: { id: courierId },
      json: { ids },
    });
    if (!res.ok) {
      toast.error(t('assign.courierAssignPage.toast.error'), {
        description: t('assign.courierAssignPage.toast.error.description'),
        style: {
          backgroundColor: '#FEEFEE',
          color: '#D8000C',
        },
      });
    }
    const data = await res.json();
    if (data) {
      setSelectedOrders([]);
      onRowSelectionChange({});
      toast.success(t('assign.courierAssignPage.toast.success'), {
        description: t('assign.courierAssignPage.toast.success.description'),
        style: {
          backgroundColor: '#F3FBEF',
          color: '#3B8C2A',
        },
      });
    }
  }

  async function handleAssignIntegrationOrders() {
    const ids = Object.keys(integrationRowSelection);
    const res = await api.order.integration.assign[':id'].$put({
      param: { id: courierId },
      json: { ids },
    });
    if (!res.ok) {
      toast.error(t('assign.courierAssignPage.toast.error'), {
        description: t('assign.courierAssignPage.toast.error.description'),
        style: {
          backgroundColor: '#FEEFEE',
          color: '#D8000C',
        },
      });
    }
    const data = await res.json();
    if (data) {
      setSelectedIntegrationOrders([]);
      onIntegrationRowSelectionChange({});
      queryClient.refetchQueries({
        queryKey: [
          'get-processing-unassigned-integration-orders',
          page,
          pageSize,
        ],
      });
      toast.success(t('assign.courierAssignPage.toast.success'), {
        description: t('assign.courierAssignPage.toast.success.description'),
        style: {
          backgroundColor: '#F3FBEF',
          color: '#3B8C2A',
        },
      });
    }
  }

  if (turuqError) {
    return <div>An Error Has Occurred: {turuqError.message}</div>;
  }

  if (integrationError) {
    return <div>An Error Has Occurred: {integrationError.message}</div>;
  }

  return (
    <div>
      <Tabs
        defaultValue="turuq"
        className="w-full"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList>
          <TabsTrigger className="" value="turuq">
            {t('orders.tabs.turuq')}
          </TabsTrigger>
          <TabsTrigger className="" value="integrations">
            {t('orders.tabs.integrations')}
          </TabsTrigger>
          <TabsTrigger className="" value="imported" disabled>
            {t('orders.tabs.imported')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="turuq" className="w-full">
          {isLoadingTuruqOrders ? (
            <TableSkeleton />
          ) : (
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                {t(
                  'assign.courierAssignPage.ordersTable.headers.processingOrders'
                )}
              </h1>
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectableOrdersDataTable
                  locale={locale}
                  columns={unassignedColumns}
                  data={turuqOrders?.orders ?? []}
                  page={page}
                  onPageChange={setPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  enableRowSelection
                  rowSelection={rowSelection}
                  onRowSelectionChange={onRowSelectionChange}
                />
              </div>
              <h1 className="font-bold text-lg text-foreground">
                {t(
                  'assign.courierAssignPage.ordersTable.headers.assignedOrders'
                )}
              </h1>
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectedOrderTable
                  locale={locale}
                  columns={unassignedSelectedColumns}
                  data={selectedOrders ?? []}
                />
                {/* <pre>{JSON.stringify(selectedOrders, null, 2)}</pre> */}
              </div>
              <div className="flex items-center justify-end">
                <Button
                  disabled={selectedOrders?.length === 0 || isPendingTuruq}
                  onClick={() => assignTuruqOrders()}
                >
                  {isPendingTuruq ? (
                    <Loader2
                      size={16}
                      className={'text-inherit animate-spin'}
                    />
                  ) : (
                    t(
                      'assign.courierAssignPage.ordersTable.buttons.assignSelected'
                    )
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="integrations" className="w-full space-y-5">
          {/* <pre>{JSON.stringify(integrationRowSelection, null, 2)}</pre> */}
          {isLoadingIntegrationOrders ? (
            <TableSkeleton />
          ) : (
            <div className="flex flex-col space-y-5">
              {t(
                'assign.courierAssignPage.ordersTable.headers.processingOrders'
              )}
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectableOrdersDataTable
                  locale={locale}
                  columns={unassignedColumns}
                  data={integrationOrders?.integrationOrders ?? []}
                  page={page}
                  onPageChange={setPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  enableRowSelection
                  rowSelection={integrationRowSelection}
                  onRowSelectionChange={onIntegrationRowSelectionChange}
                />
              </div>
              {t('assign.courierAssignPage.ordersTable.headers.assignedOrders')}
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectedOrderTable
                  locale={locale}
                  columns={unassignedSelectedColumns}
                  data={selectedIntegrationOrders ?? []}
                />
                {/* <pre>{JSON.stringify(selectedOrders, null, 2)}</pre> */}
              </div>
              <div className="flex items-center justify-end">
                <Button
                  disabled={
                    selectedIntegrationOrders?.length === 0 ||
                    isPendingIntegrations
                  }
                  onClick={() => assignIntegrationOrders()}
                >
                  {isPendingIntegrations ? (
                    <Loader2
                      size={16}
                      className={'text-inherit animate-spin'}
                    />
                  ) : (
                    t(
                      'assign.courierAssignPage.ordersTable.buttons.assignSelected'
                    )
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="imported">Coming Soon!</TabsContent>
      </Tabs>
    </div>
  );
}

'use client';
import { ws } from '@/app/actions/api';
import {
  unassignedColumns,
  unassignedSelectedColumns,
} from '@/components/tables/orders/order-columns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { hasActiveBatch } from '@/app/actions/batch-actions';
import {
  assignIntegrationOrders,
  assignTuruqOrders,
  getProcessingUnassignedIntegrationOrders,
  getProcessingUnassignedTuruqOrders,
} from '@/app/actions/order-actions';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { icons } from '@/components/icons/icons';
import { SelectableOrdersDataTable } from '@/components/tables/orders/selectable-data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import queryClient from '@/lib/query/query-client';
import { OrderType } from '@/types/order';
import { ToastStyles } from '@/utils/styles';
import { RowSelectionState } from '@tanstack/react-table';
import {
  CircleCheckIcon,
  CircleIcon,
  CircleXIcon,
  Loader2,
  ScanBarcodeIcon,
  Trash2Icon,
  UsbIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import SelectedOrderTable from './selected-orders-table';

// const ws = client.ws.$ws();

export default function Page({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const t = useTranslations('courierManager.tabs');
  const info = useTranslations('batch.info');
  const scanner = useTranslations('scanner');

  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<{ [key: string]: boolean | string }>(
    {}
  );
  const [turuqPage, setTuruqPage] = useState<number>(1);
  const [integrationPage, setIntegrationPage] = useState<number>(1);
  const [turuqPageSize, setTuruqPageSize] = useState<number>(10);
  const [integrationPageSize, setIntegrationPageSize] = useState<number>(10);

  const [selectedOrders, setSelectedOrders] = useState<OrderType[]>([]);
  const [selectedIntegrationOrders, setSelectedIntegrationOrders] = useState<
    OrderType[]
  >([]);

  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({});
  const [integrationRowSelection, onIntegrationRowSelectionChange] =
    useState<RowSelectionState>({});

  const [assigningTuruqLoading, setAssigningTuruqLoading] = useState(false);
  const [assigningIntegrationLoading, setAssigningIntegrationLoading] =
    useState(false);

  const {
    isPending: isLoadingTuruqOrders,
    data: turuqOrders,
    error: turuqError,
    refetch: refetchTuruqOrders,
  } = useQuery({
    queryKey: [
      'get-processing-unassigned-turuq-orders',
      turuqPage,
      turuqPageSize,
    ],
    queryFn: () =>
      getProcessingUnassignedTuruqOrders({
        page: turuqPage.toString(),
        pageSize: turuqPageSize.toString(),
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  const {
    isPending: isLoadingIntegrationOrders,
    data: integrationOrders,
    error: integrationError,
    refetch: refetchIntegrationOrders,
  } = useQuery({
    queryKey: [
      'get-processing-unassigned-integration-orders',
      integrationPage,
      integrationPageSize,
    ],
    queryFn: () =>
      getProcessingUnassignedIntegrationOrders({
        page: integrationPage.toString(),
        pageSize: integrationPageSize.toString(),
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: hasActive } = useQuery({
    queryKey: ['has-active-batch', courierId],
    queryFn: () => hasActiveBatch({ id: courierId }),
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
      queryKey: [
        'get-processing-unassigned-turuq-orders',
        turuqPage + 1,
        turuqPageSize,
      ],
      queryFn: () =>
        getProcessingUnassignedTuruqOrders({
          page: turuqPage.toString(),
          pageSize: turuqPageSize.toString(),
        }),
      staleTime: 1000 * 60, // 1 minute
    });
  }, [turuqPage, turuqPageSize, turuqOrders]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [
        'get-processing-unassigned-integration-orders',
        integrationPage + 1,
        integrationPageSize,
      ],
      queryFn: () =>
        getProcessingUnassignedIntegrationOrders({
          page: integrationPage.toString(),
          pageSize: integrationPageSize.toString(),
        }),
      staleTime: 1000 * 60, // 1 minute
    });
  }, [integrationPage, integrationPageSize, integrationOrders]);

  async function handleAssignOrders() {
    setAssigningTuruqLoading(true);
    const ids = Object.keys(rowSelection);
    const res = await assignTuruqOrders({
      id: courierId,
      ids,
    });
    if (res.error) {
      setAssigningTuruqLoading(false);
      toast.error(t('assign.courierAssignPage.toast.error.header'), {
        description: t('assign.courierAssignPage.toast.error.description'),
        style: ToastStyles.error,
      });
    } else {
      setAssigningTuruqLoading(false);
      setSelectedOrders([]);
      onRowSelectionChange({});
      refetchTuruqOrders();
      toast.success(t('assign.courierAssignPage.toast.success.header'), {
        description: t('assign.courierAssignPage.toast.success.description'),
        style: ToastStyles.success,
      });
    }
  }

  async function handleAssignIntegrationOrders() {
    setAssigningIntegrationLoading(true);
    const ids = Object.keys(integrationRowSelection);
    const res = await assignIntegrationOrders({
      id: courierId,
      ids,
    });

    if (res.error) {
      setAssigningIntegrationLoading(false);
      toast.error(t('assign.courierAssignPage.toast.error.header'), {
        description: t('assign.courierAssignPage.toast.error.description'),
        style: {
          backgroundColor: '#FEEFEE',
          color: '#D8000C',
        },
      });
    } else {
      setAssigningIntegrationLoading(false);
      setSelectedIntegrationOrders([]);
      onIntegrationRowSelectionChange({});
      refetchIntegrationOrders();
      toast.success(t('assign.courierAssignPage.toast.success.header'), {
        description: t('assign.courierAssignPage.toast.success.description'),
        style: {
          backgroundColor: '#F3FBEF',
          color: '#3B8C2A',
        },
      });
    }
  }

  useEffect(() => {
    ws.onmessage = (evt) => {
      console.log(evt);
      const data = JSON.parse(evt.data);
      if (data) {
        if (
          ['openingPort', 'portOpen', 'socketOpened', 'portClosed'].includes(
            data.message
          )
        ) {
          setMessage((oldVal) => ({ ...oldVal, [data.message]: true }));
        } else if (data.error) {
          toast.error(scanner(data.error), {
            style: ToastStyles.error,
          });
          setScanning(false);
        } else {
          const order: OrderType = data.order;
          if (order) {
            if (order?.provider) {
              setSelectedIntegrationOrders((oldVal) => [...oldVal, order]);
              onIntegrationRowSelectionChange((oldVal) => ({
                ...oldVal,
                [order._id]: true,
              }));
            } else {
              setSelectedOrders((oldVal) => [...oldVal, order]);
              onRowSelectionChange((oldVal) => ({
                ...oldVal,
                [order._id]: true,
              }));
            }
          }
          if (scanning) {
            setMessage({});
            ws.send(
              JSON.stringify({ message: 'assign-processing-unassigned' })
            );
          }
        }
      }
    };
  }, [scanning]);

  const handleSocket = async () => {
    setScanning(true);
    ws.send(JSON.stringify({ message: 'assign-processing-unassigned' }));
  };

  if (turuqError) {
    return <div>An Error Has Occurred: {turuqError.message}</div>;
  }

  if (integrationError) {
    return <div>An Error Has Occurred: {integrationError.message}</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {hasActive && (
        <Alert className="bg-amber-500 dark:bg-amber-300 text-light dark:text-dark">
          <div className="flex items-start gap-2">
            <div className="text-inherit">{icons.info}</div>
            <div className="flex flex-col gap-1">
              <AlertTitle className="font-bold">{info('title')}</AlertTitle>
              <AlertDescription className="">
                {info('description')}
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
        <div className="flex items-center justify-between w-full gap-5">
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
          {!scanning && (
            <Button onClick={handleSocket}>
              {t('assign.courierAssignPage.ordersTable.buttons.startScanning')}
            </Button>
          )}
          {scanning && (
            <div className="grid grid-cols-3 w-auto rounded-xl bg-light dark:bg-dark_border p-2">
              <div className="flex flex-col gap-1 items-center justify-center">
                {ws.CONNECTING ? (
                  <Loader2 size={16} className={'text-inherit animate-spin'} />
                ) : ws.OPEN ? (
                  <CircleCheckIcon size={16} className={'text-emerald-500'} />
                ) : (
                  <CircleXIcon size={16} className={'text-red-500'} />
                )}
                {ws.OPEN && (
                  <p className="text-xs font-bold">
                    {scanner('connectionEstablished')}
                  </p>
                )}
              </div>
              <div
                className={`flex flex-col gap-1 items-center justify-center`}
              >
                {!message.openingPort ? (
                  <CircleIcon size={16} className={'text-inherit'} />
                ) : (
                  <UsbIcon size={16} className={'text-emerald-500'} />
                )}
                {message.openingPort && (
                  <p className="text-xs font-bold">{scanner('portReady')}</p>
                )}
              </div>
              <div
                className={`flex flex-col gap-1 items-center justify-center`}
              >
                {!message.portOpen ? (
                  <CircleIcon size={16} className={'text-inherit'} />
                ) : (
                  <ScanBarcodeIcon size={16} className={'text-emerald-500'} />
                )}
                {message.portOpen && (
                  <p className="text-xs font-bold">
                    {scanner('scannerConnected')}
                  </p>
                )}
              </div>
              {/* <div
                className={`flex flex-col gap-1 items-center justify-center ${message.portClosed ? 'text-emerald-500' : 'text-accent'}`}
              >
                {!message.portOpen ? (
                  <CircleIcon size={16} className={'text-muted'} />
                ) : message.portOpen && !message.portClosed ? (
                  <Loader2 size={16} className={'text-inherit animate-spin'} />
                ) : (
                  <BarcodeIcon size={16} className={'text-inherit'} />
                )}
                {message.portOpen && !message.portClosed && (
                  <p className="text-xs font-bold">Waiting for Barcode Scan</p>
                )}
              </div> */}
            </div>
          )}
        </div>
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
                  page={turuqPage}
                  onPageChange={setTuruqPage}
                  pageSize={turuqPageSize}
                  onPageSizeChange={setTuruqPageSize}
                  enableRowSelection
                  rowSelection={rowSelection}
                  onRowSelectionChange={onRowSelectionChange}
                  totalPages={turuqOrders?.totalPages ?? 1}
                />
              </div>
              <div className="flex items-center justify-between gap-5">
                <h1 className="font-bold text-lg text-foreground">
                  {t(
                    'assign.courierAssignPage.ordersTable.headers.assignedOrders'
                  )}
                </h1>
              </div>
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectedOrderTable
                  locale={locale}
                  columns={unassignedSelectedColumns}
                  data={selectedOrders ?? []}
                />
                {/* <pre>{JSON.stringify(selectedOrders, null, 2)}</pre> */}
                {Object.keys(rowSelection).length > 0 && (
                  <div className="relative bottom-0 w-[400px] h-10 flex items-center justify-between rounded-xl p-5 dark:bg-light dark:text-dark_border bg-dark_border text-light">
                    <div className="flex items-center gap-2">
                      {icons.checkbox}
                      <p className="text-xs font-bold">
                        {Object.keys(rowSelection).length} Selected Orders
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 text-red-500 group"
                      onClick={() => {
                        setSelectedOrders([]);
                        onRowSelectionChange({});
                      }}
                    >
                      <Trash2Icon size={16} />
                      <p className="text-xs font-bold hidden group-hover:flex">
                        Clear Selection
                      </p>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={
                        selectedOrders?.length === 0 || assigningTuruqLoading
                      }
                    >
                      {assigningTuruqLoading ? (
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
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        You are about to assign orders to a courier?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please make sure that you selected the correct orders
                        before proceeding.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAssignOrders}>
                        {assigningTuruqLoading ? (
                          <Loader2
                            size={16}
                            className={'text-inherit animate-spin'}
                          />
                        ) : (
                          t(
                            'assign.courierAssignPage.ordersTable.buttons.assignSelected'
                          )
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
              <h1 className="font-bold text-lg text-foreground">
                {t(
                  'assign.courierAssignPage.ordersTable.headers.processingOrders'
                )}
              </h1>
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectableOrdersDataTable
                  locale={locale}
                  columns={unassignedColumns}
                  data={integrationOrders?.integrationOrders ?? []}
                  page={integrationPage}
                  onPageChange={setIntegrationPage}
                  pageSize={integrationPageSize}
                  onPageSizeChange={setIntegrationPageSize}
                  enableRowSelection
                  rowSelection={integrationRowSelection}
                  onRowSelectionChange={onIntegrationRowSelectionChange}
                  totalPages={integrationOrders?.totalPages ?? 1}
                />
              </div>
              <div className="flex items-center justify-between gap-5">
                <h1 className="font-bold text-lg text-foreground">
                  {t(
                    'assign.courierAssignPage.ordersTable.headers.assignedOrders'
                  )}
                </h1>
              </div>
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
                <SelectedOrderTable
                  locale={locale}
                  columns={unassignedSelectedColumns}
                  data={selectedIntegrationOrders ?? []}
                />
                {Object.keys(integrationRowSelection).length > 0 && (
                  <div className="relative bottom-0 w-[400px] h-10 flex items-center justify-between rounded-xl p-5 dark:bg-light dark:text-dark_border bg-dark_border text-light">
                    <div className="flex items-center gap-2">
                      {icons.checkbox}
                      <p className="text-xs font-bold">
                        {Object.keys(integrationRowSelection).length} Selected
                        Orders
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 text-red-500 group"
                      onClick={() => {
                        setSelectedIntegrationOrders([]);
                        onIntegrationRowSelectionChange({});
                      }}
                    >
                      <Trash2Icon size={16} />
                      <p className="text-xs font-bold hidden group-hover:flex">
                        Clear Selection
                      </p>
                    </button>
                  </div>
                )}
                {/* <pre>{JSON.stringify(selectedIntegrationOrders, null, 2)}</pre> */}
              </div>
              <div className="flex items-center justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={
                        selectedIntegrationOrders?.length === 0 ||
                        assigningIntegrationLoading
                      }
                    >
                      {assigningIntegrationLoading ? (
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
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        You are about to assign orders to a courier?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please make sure that you selected the correct orders
                        before proceeding.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAssignIntegrationOrders}
                      >
                        {assigningIntegrationLoading ? (
                          <Loader2
                            size={16}
                            className={'text-inherit animate-spin'}
                          />
                        ) : (
                          t(
                            'assign.courierAssignPage.ordersTable.buttons.assignSelected'
                          )
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="imported">Coming Soon!</TabsContent>
      </Tabs>
    </div>
  );
}

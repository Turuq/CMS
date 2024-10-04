'use client';
import { useState, useMemo } from 'react';
import { OrderType } from '@/types/order';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/tables/orders/order-columns';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/providers/dictionary-provider';
import { DotIcon } from 'lucide-react';
import { toast } from 'sonner';
import { processingOrdersColumns } from '@/app/[locale]/courier-manager/assign/[courierId]/processing-orders-columns';
import { DataTable } from '../../components/table/processing-orders-table';
import AssignedOrdersTable from '../../components/table/assigned-orders-table';
interface ICourierAssignPageProps {
  params: {
    courierId: string;
  };
}
export default function CourierAssignPage({
  params: { courierId },
}: ICourierAssignPageProps) {
  const { dictionary, locale } = useDictionary();
  console.log(dictionary);
  const assignPageDictionary =
    dictionary['courierManager']['tabs']['assign']['courierAssignPage'];
  const tabs = assignPageDictionary['tabs'];
  const tableDictionary = assignPageDictionary['ordersTable'];
  const toastDictionary = assignPageDictionary['toast'];
  const router = useRouter();
  const [assignedOrders, setAssignedOrders] = useState<OrderType[]>([]);
  const [removedAssignedOrder, setRemovedAssignedOrder] = useState<OrderType>();
  const [activeOrdersTab, setActiveOrdersTab] = useState<string>(tabs.turuq);
  const memoizedColumns = useMemo(() => processingOrdersColumns, []);
  const handleAssignSelected = (orders: OrderType[]) => {
    setAssignedOrders((prev) => [...prev, ...orders]);
  };
  const handleRemoveOrder = (orderOID: string) => {
    const orderToRemove = assignedOrders.find(
      (order) => order.OID === orderOID
    );
    if (orderToRemove) {
      setAssignedOrders((prev) =>
        prev.filter((order) => order.OID !== orderOID)
      );
      setRemovedAssignedOrder(orderToRemove);
    }
  };
  const handleFinishAssignment = () => {
    try {
      // Finish assignment here ... (e.g. send data to the server)
      console.log(
        `Orders ${assignedOrders} have been assigned to courier ${courierId}`
      );
      toast['success'](toastDictionary.success.header, {
        description: toastDictionary.success.description,
        style: {
          backgroundColor: '#F3FBEF',
          color: '#3B8C2A',
          position: 'fixed',
          bottom: '20px',
          left: locale === 'ar' ? '20px' : 'auto',
          right: locale === 'ar' ? 'auto' : '20px',
        },
        className: `flex ${
          locale === 'en' ? 'flex-row' : 'flex-row-reverse'
        } items-right gap-2`,
        duration: 5000,
        closeButton: true,
      });
      // After finishing, redirect to the courier manager page
      router.push(`/${locale}/assignment-officer/assign`);
    } catch (error) {
      console.error(error);
      toast['error'](toastDictionary.error.header, {
        description: toastDictionary.error.description,
        style: {
          backgroundColor: '#FEEFEE',
          color: '#D8000C',
        },
        duration: 5000,
        closeButton: true,
      });
    }
  };
  return (
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <div className="flex flex-col gap-5 px-5 mb-4">
        <nav
          className={`w-full`}
          style={{ direction: locale === 'en' ? 'ltr' : 'rtl' }}
        >
          <div
            id="nav-router"
            className={`flex items-center justify-around py-2 gap-2 rounded-full bg-light dark:bg-dark_border flex-wrap`}
          >
            {[tabs.turuq, tabs.integrations, tabs.imported].map(
              (tab: string) => (
                <button
                  key={tab}
                  onClick={() => setActiveOrdersTab(tab)}
                  className={`flex items-center justify-center px-4 py-2 w-full md:w-auto text-center text-xs lg:text-sm ${
                    activeOrdersTab === tab ? 'text-accent' : 'opacity-45'
                  }`}
                >
                  <DotIcon
                    size={16}
                    className={`text-inherit transition-opacity ${
                      activeOrdersTab === tab ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span className="font-bold">{tab}</span>
                </button>
              )
            )}
          </div>
        </nav>
      </div>
      <DataTable
        columns={memoizedColumns}
        handleAssignSelected={handleAssignSelected}
        removedAssignedOrder={removedAssignedOrder}
        setRemovedAssignedOrder={setRemovedAssignedOrder}
        activeOrdersTab={activeOrdersTab}
        tableDictionary={tableDictionary}
        locale={locale}
      />
      {/* Assigned Orders Table */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5">
          {tableDictionary.headers.assignedOrders}
        </h2>
        <AssignedOrdersTable
          data={assignedOrders}
          columns={columns}
          onRemove={handleRemoveOrder}
          tableDictionary={tableDictionary}
          locale={locale}
        />
      </div>
      {/* Finish Button */}
      <div className="flex justify-end mt-10">
        <Button
          onClick={handleFinishAssignment}
          disabled={!assignedOrders.length}
        >
          {tableDictionary.buttons.finish}
        </Button>
      </div>
    </div>
  );
}

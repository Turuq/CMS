'use client';

import { api } from '@/app/actions/api';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import StaffManagementTable from './management-table';
import { courierStaffColumns } from '@/components/tables/orders/order-columns';

export default function Page() {
  // const { locale, dictionary } = useDictionary();
  // const tabs = dictionary['courierManager']['tabs']['manage']['tabs'];
  // const tableDictionary =
  //   dictionary['courierManager']['tabs']['manage']['table'];
  // const formDictionary =
  //   dictionary['courierManager']['tabs']['manage']['form']['fields'];

  // const [selectedRow, setSelectedRow] = useState<any>(null);
  // const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    data: couriers,
    error: couriersError,
    isPending: fetchingCouriers,
  } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: async () => {
      const res = await api.courier.$get();
      if (!res.ok) {
        throw new Error('Failed to get couriers');
      }
      const data = await res.json();
      return data;
    },
  });

  if (couriersError) {
    return <div>An Error Has Occurred: {couriersError.message}</div>;
  }

  return (
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <Tabs defaultValue="handover-officers" className="w-full">
        <TabsList>
          <TabsTrigger className="" value="handover-officers">
            Handover Officers
          </TabsTrigger>
          <TabsTrigger className="" value="assignment-officers">
            Assignment Officers
          </TabsTrigger>
          <TabsTrigger className="" value="couriers">
            Couriers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="handover-officers" className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                Handover Officers
              </h1>
            </div>
            <Button onClick={() => {}}>Add Handover Officer</Button>
          </div>
        </TabsContent>
        <TabsContent value="assignment-officers">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                Assignment Officers
              </h1>
            </div>
            <Button onClick={() => {}}>Add Assignment Officer</Button>
          </div>
        </TabsContent>
        <TabsContent value="couriers" className="w-full">
          <div className="flex flex-col space-y-5 w-full">
            <div className="flex items-start justify-between gap-5 w-full">
              <h1 className="font-bold text-lg text-foreground">Couriers</h1>
              <Button onClick={() => {}}>Add Courier</Button>
            </div>
            {fetchingCouriers ? (
              <TableSkeleton />
            ) : (
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border w-full">
                <StaffManagementTable
                  columns={courierStaffColumns}
                  data={couriers}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* {isAdding && !selectedRow && (
        <Form
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          dict={formDictionary}
          tabs={tabs}
          activeTab={''}
        />
      )}

      {!isAdding && selectedRow && (
        <Form
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          dict={formDictionary}
          tabs={tabs}
          activeTab={''}
        />
      )}

      {!isAdding && !selectedRow && (
        <RoleTable
          tabs={tabs}
          activeTab={''}
          tableDictionary={tableDictionary}
          locale={locale}
          setSelectedRow={(row: any) => setSelectedRow(row)}
          setIsAdding={setIsAdding}
        />
      )} */}
    </div>
  );
}

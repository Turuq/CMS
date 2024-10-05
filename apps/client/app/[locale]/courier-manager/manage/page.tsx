'use client';

import { api } from '@/app/actions/api';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import StaffManagementTable from './management-table';
import { courierStaffColumns } from '@/components/tables/orders/order-columns';
import { useTranslations } from 'next-intl';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('courierManager.tabs.manage');
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
      <Tabs
        defaultValue="handover-officers"
        className="w-full"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList>
          <TabsTrigger className="" value="handover-officers">
            {t('tabs.handoverOfficers')}
          </TabsTrigger>
          <TabsTrigger className="" value="assignment-officers">
            {t('tabs.assignmentOfficers')}
          </TabsTrigger>
          <TabsTrigger className="" value="couriers">
            {t('tabs.couriers')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="handover-officers" className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                {t('tabs.handoverOfficers')}
              </h1>
            </div>
            <Button onClick={() => {}}>
              {t('form.handoverOfficers.headers.addHandoverOfficer')}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="assignment-officers">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                {t('tabs.assignmentOfficers')}
              </h1>
            </div>
            <Button onClick={() => {}}>
              {t('form.assignmentOfficers.headers.addAssignmentOfficer')}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="couriers" className="w-full">
          <div className="flex flex-col space-y-5 w-full">
            <div className="flex items-start justify-between gap-5 w-full">
              <h1 className="font-bold text-lg text-foreground">
                {t('tabs.couriers')}
              </h1>
              <Button onClick={() => {}}>
                {t('form.couriers.headers.addCourier')}
              </Button>
            </div>
            {fetchingCouriers ? (
              <TableSkeleton />
            ) : (
              <div className="p-2 rounded-xl bg-light dark:bg-dark_border w-full">
                <StaffManagementTable
                  locale={locale}
                  columns={courierStaffColumns}
                  data={couriers}
                  type="courier"
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

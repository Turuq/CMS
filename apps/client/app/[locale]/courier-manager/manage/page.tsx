'use client';

import { api } from '@/app/actions/api';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { courierStaffColumns } from '@/components/tables/orders/order-columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import StaffManagementTable from './management-table';

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
            <Link
              href={'manage/create/staff'}
              className="h-8 px-4 py-2 rounded-xl text-xs font-semibold w-auto bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {t('form.handoverOfficers.headers.addHandoverOfficer')}
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="assignment-officers">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-5">
              <h1 className="font-bold text-lg text-foreground">
                {t('tabs.assignmentOfficers')}
              </h1>
            </div>
            <Link
              href={'manage/create/staff'}
              className="h-8 px-4 py-2 rounded-xl text-xs font-semibold w-auto bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {t('form.assignmentOfficers.headers.addAssignmentOfficer')}
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="couriers" className="w-full">
          <div className="flex flex-col space-y-5 w-full">
            <div className="flex items-start justify-between gap-5 w-full">
              <h1 className="font-bold text-lg text-foreground">
                {t('tabs.couriers')}
              </h1>
              <Link
                href={'manage/create/courier'}
                className="h-8 px-4 py-2 rounded-xl text-xs font-semibold w-auto bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {t('form.couriers.headers.addCourier')}
              </Link>
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

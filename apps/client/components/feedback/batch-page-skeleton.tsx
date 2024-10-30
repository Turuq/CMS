import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CourierCardSkeleton from './courier-card-skeleton';
import KpiCardSkeleton from './kpi-card-skeleton';
import TableSkeleton from './table-skeleton';

export default function BatchPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <Skeleton className="w-60 h-10" />
        <div className="flex items-center gap-3 text-base lg:text-3xl font-black text-opacity-80">
          <Skeleton className="w-60 h-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 w-full">
          <CourierCardSkeleton />
        </div>
        <div className="col-span-1 lg:col-span-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="col-span-1 lg:col-span-2">
            <KpiCardSkeleton />
          </div>
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
      </div>
      <Tabs defaultValue="turuq" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="turuq">Turuq</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="turuq">
          <div className="w-full">
            <TableSkeleton />
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="w-full">
            <TableSkeleton />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { getDictionary } from '../dictionaries';
import OrdersTable from '@/components/tables/orders/fetch-orders';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FeedbackToast from '@/components/feedback/feedback-toast';
import TableSkeleton from '@/components/feedback/table-skeleton';
import { Separator } from '@/components/ui/separator';
import OrderSummaryCard from '@/components/cards/order-summary';
import { orders } from '@/utils/data/dummy';
import DetailedOrderCard from '@/components/cards/detailed-order';
import KpiCard from '@/components/cards/kpi-card';
import { TrendingUpIcon } from 'lucide-react';
import moment from 'moment';
import ExpandableKpiCard from '@/components/cards/expandable-kpi-card';
import CourierCard from '@/components/cards/courier-card';
import CourierCardSkeleton from '@/components/feedback/courier-card-skeleton';
import KpiCardSkeleton from '@/components/feedback/kpi-card-skeleton';

const order = {
  orderImages: {
    proofOfContact:
      'https://cvurqtyyadqvtbvyshns.supabase.co/storage/v1/object/public/courier/1724707985215.jpeg',
  },
  _id: '66ca35cbcae0f4f2e6641b43',
  customer: {
    name: 'Naif el kady',
    phone: '01018372878',
    address:
      '74 abbas el akaad - nasr city \nFloor 6 , apartment 11 \nLandmark : Suez Canal bank',
    governorate: 'Cairo',
    _id: '66ca35cbcae0f4f2e6641b44',
  },
  products: [
    {
      UID: '1005302076001',
      quantity: 1,
      price: 0,
      returned: 0,
      type: 'RETURNED',
      _id: '66ca35cbcae0f4f2e6641b45',
    },
    {
      UID: '1005302056001',
      quantity: 1,
      price: 0,
      returned: 0,
      type: 'ADDED',
      _id: '66ca35cbcae0f4f2e6641b46',
    },
  ],
  client: {
    _id: '66ab47e06084d50c918d94d1',
    companyName: 'Laqta',
  },
  subtotal: 1,
  total: 51,
  shippingFees: 50,
  status: 'delivered',
  notes: '',
  type: 'EXCHANGE',
  missedOpportunity: false,
  reshipped: false,
  toBeReshipped: false,
  isOutstanding: false,
  paidShippingOnly: false,
  gotGhosted: false,
  hasReturnedItems: true,
  createdAt: '2024-08-24T19:34:35.617Z',
  updatedAt: '2024-08-26T21:33:26.092Z',
  OID: '0000000022331',
  __v: 0,
  statusHistory: {
    delivered: '2024-08-26T21:33:26.091Z',
    outForDelivery: '2024-08-25T11:43:06.255Z',
    processing: '2024-08-25T11:11:17.348Z',
    _id: '66cb11556ff91ddb4bea96ea',
  },
  courier: {
    _id: '66c25a4b8c80a6b33db1d884',
    name: 'احمد ناصر عبدالنعيم',
  },
  courierAssignedAt: '2024-08-25T11:31:54.040Z',
  courierCOD: 50,
  paymentMethod: 'CASH',
};

const chartConfig = {
  data: [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ],
  categories: ['uv', 'pv', 'amt'],
  index: 'name',
  colors: ['blue', 'gray', 'lime'],
};

const courier = [
  {
    name: 'Ahmed Nasser',
    username: 'ahmed.nasser',
    phone: '01018372878',
    zone: 'Cairo',
    _id: '66c25a4b8c80a6b33db1d884',
  },
  {
    name: 'mohamed ali',
    username: 'mohamed.ali',
    phone: '01018372878',
    zone: 'Giza',
    _id: '66c25a4b8c80a6b33db1d885',
  },
  {
    name: 'ammar Ahmed',
    username: 'ammar.ahmed',
    phone: '01018372878',
    zone: 'Alexandria',
    _id: '66c25a4b8c80a6b33db1d886',
  },
  {
    name: 'Khaled mohamed',
    username: 'khaled.mohamed',
    phone: '01018372878',
    zone: 'Luxor',
    _id: '66c25a4b8c80a6b33db1d887',
  },
];

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col gap-5">
      <h1 className="text-3xl font-bold opacity-80">{dict.dashboard}</h1>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-3 lg:col-span-2">
          <OrdersTable />
        </div>
        <div className="col-span-3 lg:col-span-1">
          <DetailedOrderCard />
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-xl bg-light dark:bg-dark_border p-10 w-full">
        <h1 className="text-xl font-black text-accent">Components</h1>
        <div className="flex lg:flex-row flex-col lg:items-center gap-5">
          <Button variant={'default'}>Default Button</Button>
          <Button variant={'outline'}>Outline Button</Button>
          <Button variant={'ghost'}>Ghost Button</Button>
          <Button variant={'destructive'}>Destructive Button</Button>
          <Button variant={'secondary'}>Secondary Button</Button>
        </div>
        <Separator />
        <DropdownMenu>
          <DropdownMenuTrigger className="text-xs font-semibold rounded-xl bg-muted/50 p-2 h-8 w-40 hover:bg-muted">
            Dropdown Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from({ length: 5 }, (_, i) => (
              <DropdownMenuItem key={i}>Item {i + 1}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator />
        <p className="text-sm italic text-balance">
          Inside the FeedbackToast component you will find the configuration of
          the toast and all the styles you need copy what is relevant to your
          use-case
        </p>
        <div className="flex lg:flex-row flex-col lg:items-center gap-5">
          <FeedbackToast
            buttonLabel="Success Feedback"
            feedBackTitle="Product Created Successfully"
            toastVariant="success"
            buttonVariant={'outline'}
            feedbackDescription="You Added a new product to Wahm Successfully!"
          />
          <FeedbackToast
            buttonLabel="Error Feedback"
            feedBackTitle="Failed to change order status"
            toastVariant="error"
            buttonVariant={'ghost'}
          />
          <FeedbackToast
            buttonLabel="Warning Feedback"
            feedBackTitle="Codiwomple's Blue Jeans is running low in stock"
            toastVariant="warning"
            buttonVariant={'ghost'}
            feedbackDescription="You can contact the supplier to restock"
            duration={10000}
          />
          <FeedbackToast
            buttonLabel="Info Feedback"
            feedBackTitle="You have 5 new orders to assign to a courier"
            toastVariant="info"
            buttonVariant={'default'}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-4 gap-5">
          <div className="w-full flex flex-col gap-1">
            <p>Default</p>
            <KpiCard statistic={2500} title="Total Orders" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Accent</p>
            <KpiCard statistic={2500} title="Total Orders" color="accent" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Warning</p>
            <KpiCard statistic={2500} title="Total Orders" color="warning" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Error</p>
            <KpiCard statistic={2500} title="Total Orders" color="error" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Basic KPI Card</p>
            <KpiCard statistic={2500} title="Total Orders" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Dotted Background KPI Card</p>
            <KpiCard statistic={2500} title="Total Orders" dotted />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Finance KPI Card</p>
            <KpiCard statistic={18623.8} title="Account Balance" financial />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Animated KPI Card</p>
            <KpiCard
              statistic={1159}
              title="Collected Balance"
              dotted
              animated
              notation="compact"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Animated Finance KPI Card</p>
            <KpiCard
              statistic={18623.8}
              title="Account Balance"
              financial
              animated
              notation="standard"
            />
          </div>
          <div className="col-span-2 w-full flex flex-col gap-1">
            <p>Description KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              dotted
              description={`${moment().format('MMMM')} Analytics`}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Icon KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              icon={<TrendingUpIcon size={24} className="text-inherit" />}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Link KPI Card</p>
            <KpiCard statistic={2500} title="Total Orders" link="#" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Area Chart KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              chart
              // @ts-ignore
              chartConfig={{ chart: 'area', ...chartConfig }}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Line Chart KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              chart
              // @ts-ignore
              chartConfig={{ chart: 'line', ...chartConfig }}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Bar Chart KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              chart
              // @ts-ignore
              chartConfig={{ chart: 'bar', ...chartConfig }}
            />
          </div>
          <div className="col-span-3 w-full flex flex-col gap-1">
            <p>Expandable KPI Card</p>
            <ExpandableKpiCard
              statistic={2500}
              title="Total Orders"
              dotted
              chart
              // @ts-ignore
              chartConfig={{ chart: 'bar', ...chartConfig }}
            >
              <OrdersTable />
            </ExpandableKpiCard>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>Action KPI Card</p>
            <KpiCard
              statistic={2500}
              title="Total Orders"
              action={
                <Button variant={'default'} className="w-20">
                  Action
                </Button>
              }
            />
          </div>
        </div>
        <Separator className="my-10" />
        <p>Courier Information Card</p>
        <div className="grid grid-cols-4 gap-5">
          {courier.map((courier, i) => (
            <CourierCard key={i} href="#" courier={courier} locale={locale} />
          ))}
        </div>
        <Separator className="my-10" />
        <p>Table Loading Skeleton</p>
        <TableSkeleton state={false}>
          <p>Table Loaded</p>
        </TableSkeleton>
        <Separator className="my-10" />
        <p>Courier Card Loading Skeleton</p>
        <div className="grid grid-cols-4 gap-5">
          <CourierCardSkeleton />
          <div className="col-span-2">
            <CourierCardSkeleton />
          </div>
          <CourierCardSkeleton />
        </div>
        <Separator className="my-10" />
        <p>KPI Card Loading Skeleton</p>
        <div className="grid grid-cols-4 gap-5">
          <KpiCardSkeleton />
          <div className="col-span-2">
            <KpiCardSkeleton />
          </div>
          <KpiCardSkeleton />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {/* Order Cards */}
        <p>Order Cards</p>
        <p>1. Mini Card</p>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-5">
            <OrderSummaryCard order={order} />
            {orders.map((order, i) => (
              // @ts-ignore
              <OrderSummaryCard key={i} order={order} />
            ))}
          </div>
          <div className="col-span-12 lg:col-span-8 flex items-center justify-center p-5">
            <p>Other Content Here...</p>
          </div>
        </div>
        <p>2. Detailed Card</p>
        <DetailedOrderCard />
      </div>
    </main>
  );
}

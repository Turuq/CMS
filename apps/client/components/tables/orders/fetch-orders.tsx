// Unlike order-data-table.tsx & order-columns.tsx, this file will run on the server, which will allow
// us to fetch data from our backend directly and pass it to the table component
// To fetch data from the backend, you can use the fetch API or `TanStack Query using Server Components`

// import { Order } from './data';
import { columns } from './order-columns';
import { OrdersDataTable } from './orders-data-table';

// async function getOrders(): Promise<Order[]> {
//   // Fetch data from the API here ...
//   return Orders;
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function OrdersTable({ orders }: { orders?: any[] }) {
  // const data = await getOrders();

  return (
    <div className="w-full bg-light dark:bg-dark_border p-2 rounded-xl">
      <OrdersDataTable columns={columns} data={orders ?? []} />
    </div>
  );
}

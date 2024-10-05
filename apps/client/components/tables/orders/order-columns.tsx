/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is used to define the columns of the table

import { Courier } from '@/api/validation/courier';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderType } from '@/types/order';
import { getIndicatorColor } from '@/utils/helpers/status-modifier';
import { ColumnDef } from '@tanstack/react-table';
import { AlertOctagonIcon } from 'lucide-react';

// There are two way to populate the table with data
// 1. By providing the accessorKey and the table will automatically populate the data
// 2. By providing the accessorFn and the table will populate the data based on the function provided
export const columns: ColumnDef<OrderType>[] = [
  {
    id: 'statusIndicator',
    cell: (row) => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className={
          getIndicatorColor(row.row.original) ??
          'dark:text-light/50 text-dark_border/50'
        }
      />
    ),
    header: () => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className="text-slate-950 dark:text-slate-50"
      />
    ),
  },
  {
    id: 'OID',
    accessorFn: (row) => parseInt(row?.OID),
    header: 'OID',
    filterFn: 'includesString',
  },
  {
    id: 'courier',
    accessorKey: 'courier.name',
    header: 'Courier',
    filterFn: 'equalsString',
  },
  {
    id: 'companyName',
    accessorKey: 'client.companyName',
    header: 'Company Name',
  },
  {
    id: 'customerName',
    accessorKey: 'customer.name',
    header: 'Customer Name',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'customer.phone',
    header: 'Phone Number',
  },
  {
    id: 'products',
    header: '# Products',
    accessorFn: (row) => row?.products?.length, //since we want the number of products only, we can access the row directly and return the length of the product array
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
  },
  {
    id: 'subtotal',
    accessorKey: 'subtotal',
    header: 'Subtotal',
  },
  {
    id: 'shippingFees',
    accessorKey: 'shippingFees',
    header: 'Shipping Fees',
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'Total',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorFn: (row) => row?.createdAt,
  },
];

export const unassignedColumns: ColumnDef<OrderType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
        aria-label="Select row"
      />
    ),
  },
  {
    id: 'statusIndicator',
    cell: (row) => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className={
          getIndicatorColor(row.row.original) ??
          'dark:text-light/50 text-dark_border/50'
        }
      />
    ),
    header: () => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className="text-slate-950 dark:text-slate-50"
      />
    ),
  },
  {
    id: 'OID',
    accessorFn: (row) => parseInt(row?.OID),
    header: 'OID',
    filterFn: 'includesString',
  },
  {
    id: 'companyName',
    accessorKey: 'client.companyName',
    header: 'Company Name',
  },
  {
    id: 'customerName',
    accessorFn: (row) =>
      row.customer.name ||
      // @ts-ignore
      `${row.customer.first_name} ${row.customer.last_name}`,
    header: 'Customer Name',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'customer.phone',
    header: 'Phone Number',
  },
  {
    id: 'products',
    header: '# Products',
    accessorFn: (row) => row?.products?.length, //since we want the number of products only, we can access the row directly and return the length of the product array
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'Total',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorFn: (row) => row.createdAt,
  },
];

export const unassignedSelectedColumns: ColumnDef<OrderType>[] = [
  {
    id: 'statusIndicator',
    cell: (row) => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className={
          getIndicatorColor(row.row.original) ??
          'dark:text-light/50 text-dark_border/50'
        }
      />
    ),
    header: () => (
      <AlertOctagonIcon
        size={16}
        strokeWidth={2}
        className="text-slate-950 dark:text-slate-50"
      />
    ),
  },
  {
    id: 'OID',
    accessorFn: (row) => parseInt(row?.OID),
    header: 'OID',
    filterFn: 'includesString',
  },
  {
    id: 'companyName',
    accessorKey: 'client.companyName',
    header: 'Company Name',
  },
  {
    id: 'customerName',
    accessorFn: (row) =>
      row.customer.name ||
      // @ts-ignore
      `${row.customer.first_name} ${row.customer.last_name}`,
    header: 'Customer Name',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'customer.phone',
    header: 'Phone Number',
  },
  {
    id: 'products',
    header: '# Products',
    accessorFn: (row) => row?.products?.length, //since we want the number of products only, we can access the row directly and return the length of the product array
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
  },
  {
    id: 'total',
    accessorKey: 'total',
    header: 'Total',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorFn: (row) => row.createdAt,
  },
];

export const courierStaffColumns: ColumnDef<
  Pick<
    Courier,
    'nationalId' | 'name' | 'phone' | 'commissionPerOrder' | 'zone' | 'active'
  > & { id: string }
>[] = [
  {
    id: 'nationalId',
    accessorKey: 'nationalId',
    header: 'National ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    id: 'commissionPerOrder',
    header: 'Commission Per Order',
    cell: (row) => (
      <span>{`${row.row.original.commissionPerOrder ?? 0}%`}</span>
    ),
  },
  {
    id: 'zone',
    header: 'Zone',
    cell: (row) => <span>{row.row.original.zone ?? 'N/A'}</span>,
  },
  {
    id: 'active',
    accessorKey: 'active',
    header: 'Active',
  },
];

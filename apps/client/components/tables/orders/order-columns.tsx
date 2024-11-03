/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is used to define the columns of the table

import { statusIcons } from '@/components/icons/status-icons';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderType } from '@/types/order';
import {
  getIndicatorColor,
  getStatusColor,
  getStatusText,
  getStatusTextColor,
} from '@/utils/helpers/status-modifier';
import { Staff } from '@/utils/validation/staff';
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
    accessorFn: (row) => (row.OID ? parseInt(row?.OID) : '-'),
    header: 'OID',
    filterFn: 'includesString',
  },
  {
    id: 'courier',
    accessorKey: 'courier.name',
    header: 'Courier',
    filterFn: 'equalsString',
    cell: (row) => (
      <span
        className={`capitalize ${!row.row.original.courier && 'text-gray-500'}`}
      >
        {row.row.original.courier ? row.row.original.courier.name : '-'}
      </span>
    ),
  },
  {
    id: 'companyName',
    accessorKey: 'client.companyName',
    header: 'Company Name',
  },
  {
    id: 'customerName',
    cell: (row) =>
      row.row.original.customer.name ||
      `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`,
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
    cell: (row) => (
      <div className="flex items-center justify-center gap-2 w-auto">
        <p
          className={`${getStatusTextColor(row.row.original.status)} flex items-center capitalize text-xs font-semibold`}
        >
          <span className="mr-2">{statusIcons[row.row.original.status]}</span>
          {getStatusText(row.row.original.status)}
        </p>
      </div>
      // <Badge
      //   className={`${getStatusColor(row.row.original.status)} capitalize rounded-xl text-xs w-32 flex items-center justify-center`}
      // >
      //   {getStatusText(row.row.original.status)}
      // </Badge>
    ),
    header: 'Status',
  },
  {
    id: 'type',
    cell: (row) => row.row.original.type || row.row.original.provider,
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
    cell: (row) =>
      row.row.original.customer.name ||
      `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`,
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
    cell: (row) => (
      <div className="flex items-center justify-center w-auto">
        <Badge
          className={`${getStatusColor(row.row.original.status)} capitalize rounded-xl text-xs w-32 flex items-center justify-center`}
        >
          {getStatusText(row.row.original.status)}
        </Badge>
      </div>
    ),
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
    accessorFn: (row) => parseInt(row.OID),
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
    cell: (row) =>
      row.row.original.customer.name ||
      `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`,

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
    cell: (row) => (
      <div className="flex items-center justify-center w-auto">
        <Badge
          className={`${getStatusColor(row.row.original.status)} capitalize rounded-xl text-xs w-32 flex items-center justify-center`}
        >
          {getStatusText(row.row.original.status)}
        </Badge>
      </div>
    ),
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

export const courierStaffColumns: ColumnDef<Staff>[] = [
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

export const staffMemberColumns: ColumnDef<Staff>[] = [
  {
    id: 'nationalId',
    accessorKey: 'nationalId',
    header: 'NationalId',
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'username',
    accessorKey: 'username',
    header: 'Username',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    id: 'active',
    accessorKey: 'active',
    header: 'Active',
  },
];

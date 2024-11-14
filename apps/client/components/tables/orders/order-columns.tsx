/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is used to define the columns of the table
import { OrderType } from '@/types/order';
import {
  getIndicatorColor,
  getStatusColor,
  getStatusText,
} from '@/utils/helpers/status-modifier';
import { Staff } from '@/utils/validation/staff';
import { ColumnDef } from '@tanstack/react-table';
import parsePhoneNumber from 'libphonenumber-js';
import { AlertOctagonIcon } from 'lucide-react';
import Link from 'next/link';

export function getColumns(locale: string): ColumnDef<OrderType>[] {
  return [
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
          {row.row.original.courier ? (
            <div className="flex flex-col items-center gap-1">
              <Link
                dir="ltr"
                href={`tel:${row.row.original.customer.phone}`}
                className="text-xs font-semibold hover:underline"
              >
                {parsePhoneNumber(
                  row.row.original.courier.phone,
                  'EG'
                )?.formatInternational()}
              </Link>
              <p className="text-xs text-dark_border/50 dark:text-light/50">
                {row.row.original.courier.name}
              </p>
            </div>
          ) : (
            '-'
          )}
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
      cell: (row) => (
        <div className="flex flex-col items-center gap-1">
          <Link
            dir="ltr"
            href={`tel:${row.row.original.customer.phone}`}
            className="text-xs font-semibold hover:underline"
          >
            {parsePhoneNumber(
              row.row.original?.customer?.phone ?? '',
              'EG'
            )?.formatInternational()}
          </Link>
          <p className="text-xs text-dark_border/50 dark:text-light/50">
            {row.row.original.customer.name ||
              `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`}
          </p>
        </div>
      ),
      header: 'Customer Name',
    },
    {
      id: 'products',
      header: '# Products',
      accessorFn: (row) => row?.products?.length.toLocaleString(`${locale}-EG`), //since we want the number of products only, we can access the row directly and return the length of the product array
    },
    {
      id: 'status',
      accessorKey: 'status',
      accessorFn: (row) => row.status,
      header: 'Status',
    },
    {
      id: 'type',
      accessorFn: (row) => row.type || row.provider,
      header: 'Type',
    },
    {
      id: 'subtotal',
      accessorKey: 'subtotal',
      accessorFn: (row) =>
        row?.subtotal.toLocaleString(`${locale}-EG`, {
          style: 'currency',
          currency: 'EGP',
        }),
      header: 'Subtotal',
    },
    {
      id: 'shippingFees',
      accessorKey: 'shippingFees',
      accessorFn: (row) =>
        row?.shippingFees.toLocaleString(`${locale}-EG`, {
          style: 'currency',
          currency: 'EGP',
        }),
      header: 'Shipping Fees',
    },
    {
      id: 'total',
      accessorKey: 'total',
      accessorFn: (row) =>
        row?.total.toLocaleString(`${locale}-EG`, {
          style: 'currency',
          currency: 'EGP',
        }),
      header: 'Total',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (row) => row.createdAt
    },
  ];
}

export const unassignedColumns: ColumnDef<OrderType>[] = [
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
    cell: (row) => (
      <span
        className={`capitalize ${!row.row.original.courier && 'text-gray-500'}`}
      >
        {row.row.original.courier ? (
          <div className="flex flex-col items-start gap-1">
            <Link
              dir="ltr"
              href={`tel:${row.row.original.customer.phone}`}
              className="text-xs font-semibold hover:underline"
            >
              {parsePhoneNumber(
                row.row.original.courier.phone,
                'EG'
              )?.formatInternational()}
            </Link>
            <p className="text-xs text-dark_border/50 dark:text-light/50">
              {row.row.original.courier.name}
            </p>
          </div>
        ) : (
          '-'
        )}
      </span>
    ),
    header: 'Company Name',
  },
  {
    id: 'customerName',
    cell: (row) => (
      <div className="flex flex-col items-start gap-1">
        <Link
          dir="ltr"
          href={`tel:${row.row.original.customer.phone}`}
          className="text-xs font-semibold hover:underline"
        >
          {parsePhoneNumber(
            row.row.original?.customer?.phone ?? '',
            'EG'
          )?.formatInternational()}
        </Link>
        <p className="text-xs text-dark_border/50 dark:text-light/50">
          {row.row.original.customer.name ||
            `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`}
        </p>
      </div>
    ),
    header: 'Customer Name',
  },
  {
    id: 'products',
    header: '# Products',
    accessorFn: (row) => row?.products?.length, //since we want the number of products only, we can access the row directly and return the length of the product array
  },
  {
    id: 'status',
    accessorKey: 'status',
    accessorFn: (row) => row.status,
    header: 'Status',
  },
  {
    id: 'type',
    accessorFn: (row) => row.type || row.provider,
    header: 'Type',
  },
  {
    id: 'total',
    accessorKey: 'total',
    accessorFn: (row) =>
      row?.total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'EGP',
      }),
    header: 'Total',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorFn: (row) => row.createdAt,
  },
];

export function getUnassignedSelectedColumns(
  locale: string
): ColumnDef<OrderType>[] {
  return [
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
      cell: (row) => (
        <div className="flex flex-col items-center gap-1">
          <Link
            dir="ltr"
            href={`tel:${row.row.original.customer.phone}`}
            className="text-xs font-semibold hover:underline"
          >
            {parsePhoneNumber(
              row.row.original?.customer?.phone ?? '',
              'EG'
            )?.formatInternational()}
          </Link>
          <p className="text-xs text-dark_border/50 dark:text-light/50">
            {row.row.original.customer.name ||
              `${row.row.original.customer.first_name} ${row.row.original.customer.last_name}`}
          </p>
        </div>
      ),
      header: 'Customer Name',
    },
    {
      id: 'products',
      header: '# Products',
      accessorFn: (row) => row?.products?.length.toLocaleString(`${locale}-EG`), //since we want the number of products only, we can access the row directly and return the length of the product array
    },
    {
      id: 'status',
      accessorKey: 'status',
      cell: (row) => (
        <div className="flex flex-col items-center justify-center w-auto">
          <div
            className={`${getStatusColor(row.row.original.status)} font-semibold border bg-opacity-15 capitalize rounded-md text-xs w-auto p-1 flex items-center justify-center`}
          >
            {getStatusText(row.row.original.status)}
          </div>
        </div>
      ),
      header: 'Status',
    },
    {
      id: 'type',
      accessorKey: 'type',
      accessorFn: (row) => row.type || row.provider,
      header: 'Type',
    },
    {
      id: 'total',
      accessorKey: 'total',
      accessorFn: (row) =>
        row?.total.toLocaleString(`${locale}-EG`, {
          style: 'currency',
          currency: 'EGP',
        }),
      header: 'Total',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorFn: (row) => row.createdAt,
    },
  ];
}

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

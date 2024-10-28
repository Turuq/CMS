/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is used to define the columns of the table

import { courierManagerIcons } from '@/app/[locale]/courier-manager/components/icons/courier-manager-icons';
import {
  activateCourier,
  deactivateCourier,
} from '@/app/actions/courier-actions';
import { activateStaff, deactivateStaff } from '@/app/actions/staff-actions';
import { statusIcons } from '@/components/icons/status-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderType } from '@/types/order';
import {
  getIndicatorColor,
  getStatusColor,
  getStatusText,
  getStatusTextColor,
} from '@/utils/helpers/status-modifier';
import { ToastStyles } from '@/utils/styles';
import { Staff } from '@/utils/validation/staff';
import { ColumnDef } from '@tanstack/react-table';
import { AlertOctagonIcon, MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function toggleActive({ id, active }: { id: string; active: boolean }) {
  if (!active) {
    activateStaff(id)
      .then(() =>
        toast.success('Staff member activated', { style: ToastStyles.success })
      )
      .catch((err) => toast.error(err.message, { style: ToastStyles.error }));
  } else {
    deactivateStaff(id)
      .then(() =>
        toast.success('Staff member deactivated', {
          style: ToastStyles.success,
        })
      )
      .catch((err) => toast.error(err.message, { style: ToastStyles.error }));
  }
}

function toggleActiveCourier({ id, active }: { id: string; active: boolean }) {
  if (!active) {
    activateCourier({ id })
      .then(() =>
        toast.success('Courier activated', { style: ToastStyles.success })
      )
      .catch((err) => toast.error(err.message, { style: ToastStyles.error }));
  } else {
    deactivateCourier({ id })
      .then(() =>
        toast.success('Courier deactivated', {
          style: ToastStyles.success,
        })
      )
      .catch((err) => toast.error(err.message, { style: ToastStyles.error }));
  }
}

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
  {
    id: 'actions',
    cell: ({ row }) => {
      const { _id, active } = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`manage/edit/courier/${_id}`} className="group">
                  <div className="flex items-center">
                    {courierManagerIcons['editStaff']}
                    <p className="ml-2 font-semibold">Edit</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="group">
                  {!active ? (
                    <div className="flex items-center">
                      {courierManagerIcons['activateStaff']}
                      <p className="ml-2 font-semibold">Activate</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {courierManagerIcons['deactivateStaff']}
                      <p className="ml-2 font-semibold">Deactivate</p>
                    </div>
                  )}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group" disabled>
                <div className="flex items-center text-red-500/50 group-hover:text-red-500">
                  {courierManagerIcons['deleteStaff']}
                  <p className="ml-2 font-semibold">Delete</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you want to {!active ? 'activate' : 'deactivate'} this
                courier?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to {!active ? 'activate' : 'deactivate'} a
                courier, please make sure that you are selecting the correct
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toggleActiveCourier({ id: _id, active })}
              >
                {!active ? 'Activate' : 'Deactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const { _id, active } = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`manage/edit/staff/${_id}`} className="group">
                  <div className="flex items-center">
                    {courierManagerIcons['editStaff']}
                    <p className="ml-2 font-semibold">Edit</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="group">
                  {!active ? (
                    <div className="flex items-center">
                      {courierManagerIcons['activateStaff']}
                      <p className="ml-2 font-semibold">Activate</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {courierManagerIcons['deactivateStaff']}
                      <p className="ml-2 font-semibold">Deactivate</p>
                    </div>
                  )}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group" disabled>
                <div className="flex items-center text-red-500/50 group-hover:text-red-500">
                  {courierManagerIcons['deleteStaff']}
                  <p className="ml-2 font-semibold">Delete</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you want to {!active ? 'activate' : 'deactivate'} this staff
                member?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to {!active ? 'activate' : 'deactivate'} a staff
                member, please make sure that you are selecting the correct
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toggleActive({ id: _id, active })}
              >
                {!active ? 'Activate' : 'Deactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

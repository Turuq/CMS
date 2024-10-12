'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Staff } from '@/utils/validation/staff';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface SelectedOrderTableProps {
  locale: string;
  columns: ColumnDef<Staff>[];
  data: Staff[];
  type: 'courier' | 'handover' | 'assignment';
}

export default function StaffManagementTable({
  locale,
  columns,
  data,
  type,
}: SelectedOrderTableProps) {
  const t = useTranslations('courierManager.tabs');
  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    columns: columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <>
      <Table>
        <TableHeader className="border-none rounded-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-none bg-light_border dark:bg-[#202122] rounded-md"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`text-sm text-center font-bold ${locale === 'ar' ? 'first:rounded-r-xl last:rounded-l-xl last:border-l-0' : 'first:rounded-l-xl last:rounded-r-xl last:border-r-0'}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.id !== 'statusIndicator'
                            ? t(`manage.table.columns.${header.id}`)
                            : header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                turuqOrders-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center text-sm">
                    {cell.column.columnDef.id === 'active' ? (
                      <>
                        <Badge
                          className={`${cell.getValue() ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'} capitalize`}
                          title={cell.getValue() ? 'Active' : 'Inactive'}
                        >
                          {/* {t(`manage.table.columns.badge.${cell.getValue()}`)} */}
                          {cell.getValue() ? 'Active' : 'Inactive'}
                        </Badge>
                      </>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {type === 'courier'
                  ? t('manage.table.dataResults.noCouriers')
                  : type === 'handover'
                    ? t('manage.table.dataResults.noHandoverOfficers')
                    : t('manage.table.dataResults.noAssignmentOfficers')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      <div className="flex items-center justify-end gap-5 w-full p-5">
        <p className="text-xs font-bold">
          {t('orders.ordersTable.pagination.footer.page')}{' '}
          {(pagination.pageIndex + 1).toLocaleString(`${locale}-EG`)}{' '}
          {t('orders.ordersTable.pagination.footer.of')}{' '}
          {table.getPageCount().toLocaleString(`${locale}-EG`)}
        </p>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
        >
          {locale === 'ar' ? (
            <ChevronRightIcon size={16} />
          ) : (
            <ChevronLeftIcon size={16} />
          )}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
        >
          {locale === 'ar' ? (
            <ChevronLeftIcon size={16} />
          ) : (
            <ChevronRightIcon size={16} />
          )}
        </button>
      </div>
    </>
  );
}

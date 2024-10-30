'use client';

import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface SelectedOrderTableProps<TData, TValue> {
  locale: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function SelectedOrderTable<TData, TValue>({
  locale,
  columns,
  data,
}: SelectedOrderTableProps<TData, TValue>) {
  const t = useTranslations('courierManager.tabs.orders.ordersTable');
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
                    className={`text-xs text-center w-auto font-bold ${locale === 'ar' ? 'first:rounded-r-xl last:rounded-l-xl' : 'first:rounded-l-xl last:rounded-r-xl'} last:border-r-0`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.id !== 'statusIndicator'
                            ? t(`columns.${header.id}`)
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
                  <TableCell key={cell.id} className="text-center text-xs">
                    {cell.column.columnDef.id === 'createdAt'
                      ? moment(cell.getValue() as string)
                          .locale(locale)
                          .format('LL')
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('empty')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      <div className="flex items-center justify-end gap-5 w-full p-5">
        <p className="text-xs font-bold">
          {t('pagination.footer.page')}{' '}
          {(pagination.pageIndex + 1).toLocaleString(`${locale}-EG`)}{' '}
          {t('pagination.footer.of')}{' '}
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

'use client';

import { icons } from '@/components/icons/icons';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { OrderType } from '@/types/order';
import { getStatusColor, getStatusText } from '@/utils/helpers/status-modifier';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/ar';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const borderRadius = {
  arStatic: 'first:rounded-r-xl last:rounded-l-xl',
  enStatic: 'first:rounded-l-xl last:rounded-r-xl',
  ar: 'last:rounded-l-xl',
  en: 'last:rounded-r-xl',
};

interface SelectedOrderTableProps<TData, TValue> {
  locale: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleRemoveOrder: (id: string) => void;
  isStatic?: boolean;
}

export default function SelectedOrderTable<TValue>({
  locale,
  columns,
  data,
  handleRemoveOrder,
  isStatic = false,
}: SelectedOrderTableProps<OrderType, TValue>) {
  const t = useTranslations('courierManager.tabs.orders.ordersTable');
  const tOrderType = useTranslations('orderType');

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
    getRowId: (row) => row._id,
  });

  function getBorderRadius() {
    if (isStatic) {
      return locale === 'ar' ? borderRadius.arStatic : borderRadius.enStatic;
    }

    return locale === 'ar' ? borderRadius.ar : borderRadius.en;
  }

  return (
    <>
      <Table>
        <TableHeader className="border-none rounded-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-none bg-light_border dark:bg-[#202122] rounded-xl"
            >
              {!isStatic && (
                <TableHead
                  key="remove"
                  className={`${locale === 'ar' ? 'rounded-r-xl' : 'rounded-l-xl'}`}
                >
                  {icons.remove}
                </TableHead>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      `text-xs text-center w-auto font-bold last:border-r-0 ${locale === 'ar' ? (!isStatic ? 'last:rounded-l-xl' : 'first:rounded-r-xl last:rounded-l-xl') : !isStatic ? 'last:rounded-r-xl' : 'first:rounded-l-xl last:rounded-r-xl'}`,
                      getBorderRadius
                    )}
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
                {!isStatic && (
                  <TableCell key="remove" className="text-start">
                    <button
                      onClick={() => handleRemoveOrder(row.id)}
                      className="hover:text-red-500"
                    >
                      {icons.remove}
                    </button>
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center text-xs">
                    {cell.column.columnDef.id === 'createdAt' ? (
                      moment(cell.getValue() as string)
                        .locale(locale)
                        .format('LL')
                    ) : cell.column.columnDef.id === 'type' ? (
                      <p>
                        {cell.getValue()
                          ? tOrderType(String(cell.getValue()).toLowerCase())
                          : '-'}
                      </p>
                    ) : cell.column.columnDef.id === 'status' ? (
                      <div className="flex flex-col gap-1 items-start justify-center w-auto">
                        <div
                          className={`${getStatusColor(cell.row.original.status)} font-semibold border bg-opacity-15 capitalize rounded-md text-xs w-auto p-1 flex items-center justify-center`}
                        >
                          {locale === 'en'
                            ? getStatusText(cell.row.original.status)
                            : t(
                                `filters.status.values.${cell.row.original.status}`
                              )}
                        </div>
                        {(() => {
                          const history = cell.row.original.statusHistory;
                          const status = cell.row.original
                            .status as keyof typeof history;
                          return (
                            <span className="text-xs font-semibold text-dark_border/50 dark:text-light/50">
                              {history && Object.keys(history)?.includes(status)
                                ? moment(history[status])
                                    .locale(locale)
                                    .format('LL')
                                : ''}
                            </span>
                          );
                        })()}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
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

'use client';

// This file is responsible for constructing the table,
// Handling all table related functions such  as sorting, filtering, pagination, etc.
// And rendering the table with the provided data and columns

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  // OnChangeFn,
  // RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

import { icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Legend } from '@tremor/react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import CourierFilter from '@/components/filters/courier-filter';
import StatusFilter from '@/components/filters/status-filter';
import { OrderType } from '@/types/order';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import 'moment/locale/ar';
import { FilterObject } from '@/api/utils/validation';
import { getStatusColor, getStatusText } from '@/utils/helpers/status-modifier';

interface SelectableOrdersDataTableProps<TValue> {
  locale: string;
  columns: ColumnDef<OrderType, TValue>[];
  data: OrderType[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  enableServerFilter?: boolean;
  // enableRowSelection?: boolean;
  // rowSelection?: RowSelectionState;
  // onRowSelectionChange?: OnChangeFn<RowSelectionState> | undefined;
}

// This a generic data table component that can be used to render any table
// To enable filtering, sorting, and pagination refer to the documentation https://tanstack.com/table/latest/docs/framework/react

export function SelectableOrdersDataTable<TValue>({
  locale,
  columns,
  data,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  enableServerFilter,
  // enableRowSelection = false,
  // rowSelection,
  // onRowSelectionChange,
}: SelectableOrdersDataTableProps<TValue>) {
  const t = useTranslations('courierManager.tabs.orders.ordersTable');
  const tOrderType = useTranslations('orderType');

  const [clientColumnFilters, setClientColumnFilters] =
    useState<ColumnFiltersState>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serverColumnFilters, setServerColumnFilters] = useState<FilterObject>(
    {}
  );
  const [courierFilter, setCourierFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters: clientColumnFilters,
      // rowSelection,
    },
    onColumnFiltersChange: setClientColumnFilters,
    // onRowSelectionChange,
    // enableRowSelection,
    getRowId: (row) => row._id,
  });

  function handleServerFilterReset() {
    setCourierFilter('');
    setStatusFilter('');
    setServerColumnFilters({});
  }

  function handleClientFilterReset() {
    setSearchValue('');
    table.resetColumnFilters();
  }

  function handleFilterReset() {
    handleServerFilterReset();
    handleClientFilterReset();
  }

  return (
    <div className="rounded-md flex flex-col gap-2">
      {/* <pre>
        {JSON.stringify({ clientColumnFilters, serverColumnFilters }, null, 2)}
      </pre> */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        {enableServerFilter && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              {/* Important Filter 1 */}
              <CourierFilter
                onServerColumnFilterChange={setServerColumnFilters}
                courierFilter={courierFilter}
                onCourierChange={setCourierFilter}
              />
              {/* Important Filter 2 */}
              <StatusFilter
                onServerColumnFilterChange={setServerColumnFilters}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />
            </div>
            {(clientColumnFilters.length > 0 ||
              Object.keys(serverColumnFilters).length > 0) && (
              <div className="flex items-center gap-2">
                <Button
                  variant={'default'}
                  className="w-auto h-8 rounded-xl hidden lg:flex items-center gap-2"
                  // onClick={handleFilterReset}
                >
                  {/* {icons.resetFilter} */}
                  <p>{t('filters.buttons.apply')}</p>
                </Button>
                <Button
                  variant={'link'}
                  className="w-auto hover:text-red-500 h-8 rounded-xl hidden lg:flex items-center gap-2"
                  onClick={handleFilterReset}
                >
                  {/* {icons.resetFilter} */}
                  <p>{t('filters.buttons.reset')}</p>
                </Button>
              </div>
            )}
            <Separator />
          </>
        )}
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-md">
        <div className="flex items-center justify-between bg-light_border dark:bg-[#202122] rounded-xl w-60 py-1 px-2 h-8">
          <div className="flex items-center gap-1">
            <span className="text-light dark:text-dark_border">
              {icons.search}
            </span>
            <input
              placeholder={t('search.placeholder')}
              className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
              onChange={(e) => {
                table.getColumn('OID')?.setFilterValue(e.target.value);
                setSearchValue(e.target.value);
              }}
              value={searchValue}
            />
          </div>
          {searchValue && (
            <button
              className="size-auto hover:text-red-500"
              onClick={handleClientFilterReset}
            >
              <XIcon size={16} className="text-inherit" />
            </button>
          )}
        </div>
        <Legend
          dir="ltr"
          categories={[
            t('legend.reshipped'),
            t('legend.instaPay'),
            t('legend.gotGhosted'),
            t('legend.returnedItems'),
            t('legend.toBeReshipped'),
          ]}
          colors={['cyan', 'violet', 'red', 'amber', 'lime']}
          // className="mx-5"
        />
        <div className="flex items-center gap-1">
          <p className="text-xs">{t('pagination.header.showing')}</p>
          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs font-bold border border-accent rounded-md h-5 w-5 hover:bg-muted">
              {pageSize.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(10);
                  onPageSizeChange(10);
                }}
              >
                {(10).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(15);
                  onPageSizeChange(15);
                }}
              >
                {(15).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(20);
                  onPageSizeChange(20);
                }}
              >
                {(20).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(25);
                  onPageSizeChange(25);
                }}
              >
                {(25).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(30);
                  onPageSizeChange(30);
                }}
              >
                {(30).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(50);
                  onPageSizeChange(50);
                }}
              >
                {(50).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs">
            {t('pagination.header.of')}{' '}
            <strong>
              {(totalPages * pageSize).toLocaleString(
                locale === 'ar' ? 'ar-EG' : 'en-US'
              )}
            </strong>{' '}
            {t('pagination.header.results')}
          </p>
        </div>
      </div>
      <div className="">
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
                      className={`text-xs text-start font-bold ${locale === 'ar' ? 'first:rounded-r-xl last:rounded-l-xl' : 'first:rounded-l-xl last:rounded-r-xl'} last:border-r-0`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.id !== 'statusIndicator' &&
                              header.id !== 'select'
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
                  data-state={row.getIsSelected() && 'selected'}
                >
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
                                {history &&
                                Object.keys(history)?.includes(status)
                                  ? moment(history[status]).format('L')
                                  : ''}
                              </span>
                            );
                          })()}
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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
            {t('pagination.footer.page')} {page.toLocaleString(`${locale}-EG`)}{' '}
            {t('pagination.footer.of')}{' '}
            {totalPages.toLocaleString(`${locale}-EG`)}
          </p>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
          >
            {locale === 'ar' ? (
              <ChevronRightIcon size={16} />
            ) : (
              <ChevronLeftIcon size={16} />
            )}
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
          >
            {locale === 'ar' ? (
              <ChevronLeftIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  OnChangeFn,
  RowSelectionState,
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

interface OrdersDataTableProps<TValue> {
  columns: ColumnDef<OrderType, TValue>[];
  data: OrderType[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  enableServerFilter?: boolean;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState> | undefined;
}

// This a generic data table component that can be used to render any table
// To enable filtering, sorting, and pagination refer to the documentation https://tanstack.com/table/latest/docs/framework/react

export function OrdersDataTable<TValue>({
  columns,
  data,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  enableServerFilter,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
}: OrdersDataTableProps<TValue>) {
  const [clientColumnFilters, setClientColumnFilters] =
    useState<ColumnFiltersState>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [serverColumnFilters, setServerColumnFilters] =
    useState<ColumnFiltersState>([]);
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
      rowSelection,
    },
    onColumnFiltersChange: setClientColumnFilters,
    onRowSelectionChange,
    enableRowSelection,
    getRowId: (row) => row._id,
  });

  function handleServerFilterReset() {
    setCourierFilter('');
    setStatusFilter('');
    setServerColumnFilters([]);
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
              {/* Other Filters */}
              {/* <Popover
          // open={open} onOpenChange={setOpen}
          >
            <PopoverTrigger
              asChild
              className="text-xs hidden lg:flex rounded-xl bg-muted/50 p-2 border-none h-8 w-40 hover:bg-muted hover:text-black dark:hover:text-white"
            >
              <Button
                variant="outline"
                role="combobox"
                //   aria-expanded={open}
                className="w-auto lg:w-40 justify-between"
              >
                <div className="flex items-center">
                  {icons.filter}
                  <span className="ml-2 hidden lg:flex">Other Filter</span>
                </div>
                {icons.chevronDown}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-52 p-0 bg-white dark:bg-dark">
              <Command className="">
                <CommandList title="Filter Orders">
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandSeparator />
                  <CommandGroup heading="Filter by Type">
                    <CommandItem>Normal</CommandItem>
                    <CommandItem>Refund</CommandItem>
                    <CommandItem>Exchange</CommandItem>
                    <CommandItem>Promotional</CommandItem>
                  </CommandGroup>
                  <CommandGroup heading="Filter by Governorate">
                    {Array.from({ length: 12 }, (_, i) => (
                      <CommandItem key={i}>Governorate {i + 1}</CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="Filter by Company">
                    {Array.from({ length: 8 }, (_, i) => (
                      <CommandItem key={i}>Company {i + 1}</CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}
              {/* Apply Filters */}
            </div>
            {clientColumnFilters.length > 0 ||
              (serverColumnFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={'default'}
                    className="w-auto h-8 rounded-xl hidden lg:flex items-center gap-2"
                    // onClick={handleFilterReset}
                  >
                    {/* {icons.resetFilter} */}
                    <p>Apply Filters</p>
                  </Button>
                  <Button
                    variant={'link'}
                    className="w-auto hover:text-red-500 h-8 rounded-xl hidden lg:flex items-center gap-2"
                    onClick={handleFilterReset}
                  >
                    {/* {icons.resetFilter} */}
                    <p>Clear Filters</p>
                  </Button>
                </div>
              ))}
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
              placeholder="Search by OID"
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
          categories={[
            'Reshipped',
            'InstaPay',
            'Got Ghosted',
            'Returned Items',
            'Paid Shipping Only',
          ]}
          colors={['cyan', 'violet', 'red', 'amber', 'lime']}
        />
        <div className="flex items-center gap-1">
          <p className="text-xs">Showing</p>
          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs font-bold border border-accent rounded-md h-5 w-5 hover:bg-muted">
              {pageSize}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(10);
                  onPageSizeChange(10);
                }}
              >
                10
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(15);
                  onPageSizeChange(15);
                }}
              >
                15
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(20);
                  onPageSizeChange(20);
                }}
              >
                20
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(25);
                  onPageSizeChange(25);
                }}
              >
                25
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(30);
                  onPageSizeChange(30);
                }}
              >
                30
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.setPageSize(50);
                  onPageSizeChange(50);
                }}
              >
                50
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs">
            of <strong>{table.getRowModel().rows.length}</strong> results
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
                      className="text-xs text-center font-bold first:rounded-l-xl last:rounded-r-xl last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Separator />
        <div className="flex items-center justify-end gap-5 w-full p-5">
          <p className="text-xs font-bold">
            Page {page} of {table.getPageCount()}
          </p>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            // disabled={}
            className="text-accent/50 hover:text-accent disabled:text-muted disabled:cursor-not-allowed disabled:hover:text-muted"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

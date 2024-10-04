import { ColumnDef, flexRender, useReactTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { icons } from '@/components/icons/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Legend } from '@tremor/react';
import { OrderType } from '@/types/order';
import CourierFilter from '@/components/filters/courier-filter';
import { useState } from 'react';
import StatusFilter from '@/components/filters/status-filter';

interface IOrdersTableBodyProps {
  table: ReturnType<typeof useReactTable<OrderType>>;
  columns: ColumnDef<OrderType>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableDictionary: Record<string, any>;
  locale: string;
  selectedFilters: {
    courier: string[];
    status: string[];
    type: string[];
    governorate: string[];
    company: string[];
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      courier: string[];
      status: string[];
      type: string[];
      governorate: string[];
      company: string[];
    }>
  >;
  setTableData: React.Dispatch<React.SetStateAction<OrderType[] | undefined>>;
  setRowCount: React.Dispatch<React.SetStateAction<number>>;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  getFilteredOrders: (
    selectedFilters: {
      courier: string[];
      status: string[];
      type: string[];
      governorate: string[];
      company: string[];
    },
    paginationIndex: number,
    paginationSize: number,
    activeOrdersTab: string
  ) => Promise<{ rows: OrderType[]; rowCount: number; pageCount: number }>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  handleClearSearch: () => void;
  setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType | null>>;
  page: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  setPage: (page: number) => void;
}

export default function OrdersTableBody({
  table,
  columns,
  tableDictionary,
  locale,
  selectedFilters,
  setSearchValue,
  searchValue,
  handleClearSearch,
  setSelectedOrder,
  page,
  pageSize,
  setPage,
  setPageSize,
}: IOrdersTableBodyProps) {
  // const dict = await getDictionary(lang);
  const [courierFilter, setCourierFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();

  function resetTableFilters() {
    setCourierFilter('');
    setStatusFilter('');
    table.resetColumnFilters();
  }
  return (
    <div className="w-full bg-light dark:bg-dark_border p-2 rounded-xl">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Important Filter 1 -> Courier Filter */}
          <CourierFilter
            table={table}
            courierFilter={courierFilter}
            setCourierFilter={setCourierFilter}
          />
          {/* Important Filter 2 */}
          <StatusFilter
            table={table}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <Popover>
            <PopoverTrigger
              disabled
              asChild
              className="text-xs rounded-xl bg-muted/50 p-2 border-none h-8 w-40 hover:bg-muted hover:text-black dark:hover:text-white"
            >
              <Button
                variant="outline"
                role="combobox"
                className="w-auto lg:w-40 justify-between"
              >
                <div className="flex items-center">
                  {icons.filter}
                  <span className="ml-2 hidden lg:flex">
                    {tableDictionary.filters.otherFilters.placeholder}
                  </span>
                </div>
                {icons.chevronDown}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-52 p-0 bg-white dark:bg-dark">
              <Command className="">
                <CommandList title="Filter Orders">
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandSeparator />
                  <CommandGroup
                    heading={tableDictionary.filters.type.placeholder}
                  >
                    <CommandItem className="cursor-pointer flex justify-between">
                      <span>Normal</span>
                      {selectedFilters.type?.includes('Normal') && (
                        <span>✔️</span>
                      )}
                    </CommandItem>
                    <CommandItem className="cursor-pointer flex justify-between">
                      <span>Refund</span>
                      {selectedFilters.type?.includes('Refund') && (
                        <span>✔️</span>
                      )}
                    </CommandItem>
                    <CommandItem className="cursor-pointer flex justify-between">
                      <span>Exchange</span>
                      {selectedFilters.type?.includes('Exchange') && (
                        <span>✔️</span>
                      )}
                    </CommandItem>
                    <CommandItem className="cursor-pointer flex justify-between">
                      <span>Promotional</span>
                      {selectedFilters.type?.includes('Promotional') && (
                        <span>✔️</span>
                      )}
                    </CommandItem>
                  </CommandGroup>
                  <CommandGroup
                    heading={tableDictionary.filters.governorate.placeholder}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <CommandItem
                        className="cursor-pointer flex justify-between"
                        key={i}
                      >
                        <span>Governorate {i + 1}</span>
                        {selectedFilters.governorate?.includes(
                          `Governorate ${i + 1}`
                        ) && <span>✔️</span>}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup
                    heading={tableDictionary.filters.company.placeholder}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <CommandItem
                        className="cursor-pointer flex justify-between"
                        key={i}
                      >
                        <span>Company {i + 1}</span>
                        {selectedFilters.company?.includes(
                          `Company ${i + 1}`
                        ) && <span>✔️</span>}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant={'default'}
          className="w-40 h-8 rounded-xl flex items-center gap-2"
          onClick={resetTableFilters}
        >
          {icons.resetFilter}
          <p>{tableDictionary.filters.buttons.reset}</p>
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-md">
        <div className="flex items-center justify-between bg-light_border dark:bg-[#202122] rounded-xl w-full sm:w-60 py-1 px-2 h-8">
          <input
            placeholder={tableDictionary.search.placeholder}
            className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
            onChange={(e) => {
              table.getColumn('OID')?.setFilterValue(e.target.value);
              setSearchValue(e.target.value);
            }}
            value={searchValue}
          />
          <div className="hover:text-accent text-xs relative group">
            {icons.search}
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-7 text-xs bg-gray-700 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 z-10">
              Search
            </span>
          </div>
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="ml-2 relative text-red-500 group"
            >
              {icons.clear}
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-7 text-xs bg-gray-700 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 z-10">
                Clear
              </span>
            </button>
          )}
        </div>
        <Legend
          categories={[
            tableDictionary.categories.reshipped,
            tableDictionary.categories.instaPay,
            tableDictionary.categories.gotGhosted,
            tableDictionary.categories.returnedItems,
          ]}
          colors={['cyan', 'violet', 'red', 'amber']}
          className="mt-2 sm:mt-0" // Add top margin on small screens for spacing
        />

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <p className="text-xs">{tableDictionary.pagination.header.showing}</p>
          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs font-bold border border-accent rounded-md h-5 w-10 hover:bg-muted">
              {pageSize}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPageSize(10)}>
                10
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPageSize(15)}>
                15
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPageSize(20)}>
                20
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPageSize(25)}>
                25
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPageSize(30)}>
                30
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPageSize(50)}>
                50
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs flex items-center gap-2">
            <span>{tableDictionary.pagination.header.of}</span>
            <strong>{table.getRowModel().rows.length}</strong>{' '}
            <span>{tableDictionary.pagination.header.results}</span>
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
                      className={`text-xs text-center font-bold last:border-r-0 ${
                        locale === 'en'
                          ? 'first:rounded-l-xl last:rounded-r-xl'
                          : 'first:rounded-l-xl last:rounded-r-xl'
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.id === 'statusIndicator'
                          ? flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          : flexRender(
                              tableDictionary.columns[
                                header.column.columnDef.id as string
                              ],
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
                  onClick={() => {
                    setSelectedOrder(row.original);
                  }}
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
                  {tableDictionary.dataResults.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center py-2 px-4">
        <div className="flex items-center gap-5">
          <button onClick={() => setPage(page > 0 ? page - 1 : 0)}>
            {icons.arrowLeft}
          </button>
          <div className="text-xs flex items-center gap-2">
            <span>{tableDictionary.pagination.footer.page}</span>
            <strong>{page}</strong>
            {/* <span>{tableDictionary.pagination.footer.of}</span> */}
            {/* <span>1</span> */}
          </div>
          <button onClick={() => setPage(page + 1)}>{icons.arrowRight}</button>
        </div>
      </div>
    </div>
  );
}

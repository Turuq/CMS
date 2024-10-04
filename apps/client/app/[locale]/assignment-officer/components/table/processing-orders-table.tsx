import { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  RowSelectionState,
  SortingState,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { icons } from '@/components/icons/icons';
import { OrderType } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Updater } from '@tanstack/react-query';
import {
  fetchData,
  fetchSelectedOrders,
  getOrderByOID,
} from '@/app/[locale]/courier-manager/assign/[courierId]/fetch-data';

interface DataTableProps {
  columns: ColumnDef<OrderType>[];
  handleAssignSelected: ((orders: OrderType[]) => void) | undefined;
  removedAssignedOrder: OrderType | undefined;
  setRemovedAssignedOrder: React.Dispatch<
    React.SetStateAction<OrderType | undefined>
  >;
  activeOrdersTab: string;
  tableDictionary: {
    [key: string]: any;
  };
  locale: string;
}

export function DataTable({
  columns,
  handleAssignSelected,
  removedAssignedOrder,
  setRemovedAssignedOrder,
  activeOrdersTab,
  tableDictionary,
  locale,
}: DataTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<RowSelectionState>({});
  const [assignedOrdersOIDs, setAssignedOrdersOIDs] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [tableData, setTableData] = useState<OrderType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  const handleRowSelectionChange = (
    updaterOrValue: Updater<RowSelectionState, RowSelectionState>
  ) => {
    setSelectedOrders((oldState) =>
      typeof updaterOrValue === 'function'
        ? updaterOrValue(oldState)
        : updaterOrValue
    );
  };

  const handleAssignSelectedOrders = async () => {
    const selectedOrdersOIDs = Object.keys(selectedOrders);
    const assignedOrders = await fetchSelectedOrders(
      selectedOrdersOIDs,
      activeOrdersTab
    );
    if (assignedOrders) {
      handleAssignSelected?.(assignedOrders);
      setAssignedOrdersOIDs((prev) => [
        ...prev,
        ...assignedOrders.map((order) => order.OID),
      ]);
    }
    setSelectedOrders({});
    setPagination({ pageIndex: 0, pageSize: 10 });
    handleClearSearch();
  };

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
    if (value === '') {
      table.getColumn('OID')?.setFilterValue('');
      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  };

  const handleSearchByOID = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!searchValue) return;
    const searchInput = document.querySelector('input') as HTMLInputElement;
    const orderOID = searchInput.value;
    if (assignedOrdersOIDs.includes(orderOID)) {
      return;
    }
    const order = await getOrderByOID(orderOID, activeOrdersTab);
    if (order) {
      setTableData([order]);
      setRowCount(1);
      setPageCount(1);
    } else {
      setTableData([]);
      setRowCount(0);
      setPageCount(0);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    table.getColumn('OID')?.setFilterValue('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const table = useReactTable({
    data: tableData,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      rowSelection: selectedOrders,
      sorting,
    },
    manualPagination: true,
    rowCount,
    pageCount,
    onPaginationChange: setPagination,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId: (row) => row.OID,
    onSortingChange: setSorting,
    debugTable: true,
  });

  useEffect(() => {
    const fetchTableData = async () => {
      const { rows, pageCount, rowCount } = await fetchData(
        pagination,
        assignedOrdersOIDs,
        activeOrdersTab
      );
      setTableData(rows);
      setPageCount(pageCount);
      setRowCount(rowCount);
    };
    fetchTableData();
  }, [pagination, assignedOrdersOIDs, activeOrdersTab]);

  useEffect(() => {
    if (removedAssignedOrder) {
      setAssignedOrdersOIDs((prev) =>
        prev.filter((oid) => oid !== removedAssignedOrder.OID)
      );
      setRemovedAssignedOrder(undefined);
    }
  }, [removedAssignedOrder]);

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          {tableDictionary.headers.processingOrders}
        </h2>
        <Button
          onClick={handleAssignSelectedOrders}
          disabled={!Object.keys(selectedOrders).length}
        >
          {tableDictionary.buttons.assignSelected}
        </Button>
      </div>
      <div className="w-full bg-light dark:bg-dark_border p-2 rounded-xl"></div>
      <div className="rounded-md flex flex-col gap-2">
        <Separator />
        <div className="flex items-center justify-between gap-5 rounded-md">
          <div className="flex items-center justify-between bg-light_border dark:bg-[#202122] rounded-xl w-60 py-1 px-2 h-8">
            <input
              placeholder={tableDictionary.search.placeholder}
              className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
              onChange={(e) => {
                table.getColumn('OID')?.setFilterValue(e.target.value);
                handleSearchValueChange(e.target.value);
              }}
              value={searchValue}
            />
            <button
              onClick={(e) => handleSearchByOID(e)}
              className="hover:text-accent"
            >
              {icons.search}
            </button>
            {/* Clear search button */}
            <button
              onClick={handleClearSearch}
              className="ml-2 font-semibold text-xs"
            >
              {tableDictionary.search.buttons.clear}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs">
              {tableDictionary.pagination.header.showing}
            </p>
            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs font-bold border border-accent rounded-md h-5 w-5 hover:bg-muted">
                {pagination.pageSize}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => table.setPageSize(10)}>
                  10
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.setPageSize(15)}>
                  15
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.setPageSize(20)}>
                  20
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.setPageSize(25)}>
                  25
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.setPageSize(30)}>
                  30
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.setPageSize(50)}>
                  50
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs">
              {tableDictionary.pagination.header.of}
              <strong>{table.getRowModel().rows.length}</strong>
              {tableDictionary.pagination.header.results}
            </p>
          </div>
        </div>
        <div className="overflow-auto">
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
                          : header.column.columnDef.id === 'statusIndicator' ||
                              header.column.columnDef.id === 'select'
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
                    {tableDictionary.dataResults.noProcessingOrders}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination controls */}
        <div className="flex justify-between items-center py-2 px-4">
          <button
            className={`text-xs py-1 px-2 rounded-md border ${
              !table.getCanPreviousPage() ? 'opacity-50' : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {locale === 'en' ? icons.arrowLeft : icons.arrowRight}
          </button>
          <div className="text-xs">
            {tableDictionary.pagination.footer.page}
            <strong>{table.getState().pagination.pageIndex + 1}</strong>
            {tableDictionary.pagination.footer.of} {table.getPageCount()}
          </div>
          <button
            className={`text-xs py-1 px-2 rounded-md border ${
              !table.getCanNextPage() ? 'opacity-50' : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            {locale === 'en' ? icons.arrowRight : icons.arrowLeft}
          </button>
        </div>
      </div>
    </>
  );
}

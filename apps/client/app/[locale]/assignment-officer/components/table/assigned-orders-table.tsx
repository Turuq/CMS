import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { icons } from '@/components/icons/icons';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/types/order';
import { Trash } from 'lucide-react';

interface DataTableProps {
  data: OrderType[];
  columns: ColumnDef<OrderType>[];
  onRemove: (id: string) => void;
  tableDictionary: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  locale: string;
}

export default function DataTable({
  data,
  columns,
  onRemove,
  tableDictionary,
  locale,
}: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button onClick={() => onRemove(row.original.OID)}>
            <Trash className="w-4 h-4 text-red-500 hover:text-red-700" />
          </button>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <div className="rounded-md flex flex-col gap-2">
      <Separator />
      <div className="flex items-center justify-end gap-5 rounded-md">
        <div className="flex items-center gap-1">
          <p className="text-xs">{tableDictionary.pagination.header.showing}</p>
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
                <TableRow key={row.id}>
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
                  colSpan={columns.length + 1} // +1 for the actions column
                  className="h-24 text-center"
                >
                  {tableDictionary.dataResults.noAssignedOrders}
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
  );
}

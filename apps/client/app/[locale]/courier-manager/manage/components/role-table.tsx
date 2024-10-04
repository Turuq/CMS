"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import { icons } from "@/components/icons/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchData,
  deleteHandoverOfficer,
  deleteAssignmentOfficer,
  deleteCourier,
} from "../fetch-data";
import DeleteConfirmationDialog from "./delete-dialog";

interface DataTableProps {
  tabs: {
    handoverOfficers: string;
    assignmentOfficers: string;
    couriers: string;
  };
  activeTab: string;
  tableDictionary: {
    [key: string]: any;
  };
  locale: string;
  setSelectedRow: (row: any) => void;
  setIsAdding: (isAdding: boolean) => void;
}

export function RoleTable({
  tabs,
  activeTab,
  tableDictionary,
  locale,
  setSelectedRow,
  setIsAdding,
}: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "joinedAt",
      desc: false,
    },
  ]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultData = useMemo(() => [], []);

  let baseColumns: ColumnDef<any, any>[] = [];
  if (
    activeTab === tabs.handoverOfficers ||
    activeTab === tabs.assignmentOfficers
  ) {
    baseColumns = [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "nationalID",
        accessorKey: "nationalID",
        header: "National ID",
      },
      {
        id: "joinedAt",
        accessorKey: "joinedAt",
        header: "Joined At",
      },
    ];
  } else if (activeTab === tabs.couriers) {
    baseColumns = [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "username",
        accessorKey: "username",
        header: "Username",
      },
      {
        id: "nationalID",
        accessorKey: "nationalID",
        header: "National ID",
      },
      {
        id: "joinedAt",
        accessorKey: "joinedAt",
        header: "Joined At",
      },
    ];
  }

  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    const actionColumn: ColumnDef<any, any> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <button onClick={() => handleEdit(row.original)}>
            <Edit className="w-4 h-4 text-blue-500 hover:text-blue-700" />
          </button>
          <button onClick={() => openDeleteDialog(row.original)}>
            <Trash className="w-4 h-4 text-red-500 hover:text-red-700" />
          </button>
        </div>
      ),
    };

    return [...baseColumns, actionColumn];
  }, [baseColumns]);

  const handleEdit = (row: any) => {
    setSelectedRow(row);
  };

  const openDeleteDialog = (row: any) => {
    setRowToDelete(row);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (activeTab === tabs.handoverOfficers) {
      await deleteHandoverOfficer(rowToDelete.id);
    } else if (activeTab === tabs.assignmentOfficers) {
      await deleteAssignmentOfficer(rowToDelete.id);
    } else if (activeTab === tabs.couriers) {
      await deleteCourier(rowToDelete.id);
    }

    setIsDialogOpen(false);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const table = useReactTable({
    data: tableData || defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount,
    pageCount,
    onSortingChange: setSorting,
  });

  const fetchTableData = async (
    pageIndex: number,
    pageSize: number,
    activeTab: string,
  ) => {
    const data = await fetchData(
      {
        pageIndex,
        pageSize,
      },
      activeTab,
    );
    setTableData(data.rows);
    setRowCount(data.rowCount);
    setPageCount(data.pageCount);
  };

  useEffect(() => {
    fetchTableData(pagination.pageIndex, pagination.pageSize, activeTab);
  }, [pagination, activeTab]);

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        setIsOpen={() => setIsDialogOpen(!isDialogOpen)}
        onConfirm={handleDelete}
        description={`Are you sure you want to delete this ${
          activeTab === tabs.couriers ? "courier" : "officer"
        }? This action cannot be undone.`}
      />
      <div className="w-full flex justify-between items-center mb-4">
        <Button className="w-fit ml-auto" onClick={() => setIsAdding(true)}>
          {activeTab === tabs.handoverOfficers &&
            tableDictionary.buttons.addHandoverOfficer}
          {activeTab === tabs.assignmentOfficers &&
            tableDictionary.buttons.addAssignmentOfficer}
          {activeTab === tabs.couriers && tableDictionary.buttons.addCourier}
        </Button>
      </div>
      <div className="w-full bg-light dark:bg-dark_border p-2 rounded-xl">
        <div className="flex items-center justify-between gap-5 rounded-md">
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
                              tableDictionary.columns[
                                header.column.columnDef.id as string
                              ],
                              header.getContext(),
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
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
        {/* Pagination controls */}
        <div className="flex justify-between items-center py-2 px-4">
          <button
            className={`text-xs py-1 px-2 rounded-md border ${
              !table.getCanPreviousPage() ? "opacity-50" : "hover:bg-gray-200"
            }`}
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {locale === "en" ? icons.arrowLeft : icons.arrowRight}
          </button>
          <div className="text-xs">
            {tableDictionary.pagination.footer.page}
            <strong>{table.getState().pagination.pageIndex + 1}</strong>
            {tableDictionary.pagination.footer.of} {table.getPageCount()}
          </div>
          <button
            className={`text-xs py-1 px-2 rounded-md border ${
              !table.getCanNextPage() ? "opacity-50" : "hover:bg-gray-200"
            }`}
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            {locale === "en" ? icons.arrowRight : icons.arrowLeft}
          </button>
        </div>
      </div>
    </>
  );
}

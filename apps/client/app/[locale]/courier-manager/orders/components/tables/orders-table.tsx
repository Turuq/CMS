'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { OrderType } from '@/types/order';
import DetailedOrderCard from '../cards/detailed-order-card';
import { getFilteredOrders } from '../../fetch-data';
import OrdersTableBody from './orders-table-body';

interface DataTableProps {
  columns: ColumnDef<OrderType>[];
  tableDictionary: {
    [key: string]: unknown;
  };
  orderCardDictionary: {
    [key: string]: unknown;
  };
  locale: string;
  tableData?: OrderType[];
  page: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  setPage: (page: number) => void;
}

export function DataTable({
  columns,
  tableDictionary,
  orderCardDictionary,
  locale,
  tableData,
  page,
  pageSize,
  setPage,
  setPageSize,
}: DataTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    courier: string[];
    status: string[];
    type: string[];
    governorate: string[];
    company: string[];
  }>({
    courier: [],
    status: [],
    type: [],
    governorate: [],
    company: [],
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false,
    },
  ]);
  // const [tableData, setTableData] = useState<OrderType[] | undefined>([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      // columnFilters,
      pagination,
      sorting,
    },
    // onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: rowCount,
    pageCount: pageCount,
    onSortingChange: setSorting,
  });

  const handleClearSearch = () => {
    setSearchValue('');
    table.getColumn('OID')?.setFilterValue('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  return (
    <>
      {selectedOrder && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-3 lg:col-span-2">
            <OrdersTableBody
              table={table}
              columns={columns}
              tableDictionary={tableDictionary}
              locale={locale}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setTableData={() => {}}
              setRowCount={setRowCount}
              setPageCount={setPageCount}
              getFilteredOrders={getFilteredOrders}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              handleClearSearch={handleClearSearch}
              setSelectedOrder={setSelectedOrder}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </div>
          <div className="col-span-3  lg:col-span-1">
            <DetailedOrderCard
              order={selectedOrder}
              orderCardDictionary={orderCardDictionary}
              locale={locale}
            />
          </div>
        </div>
      )}

      {!selectedOrder && (
        <OrdersTableBody
          table={table}
          columns={columns}
          tableDictionary={tableDictionary}
          locale={locale}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setTableData={() => {}}
          setRowCount={setRowCount}
          setPageCount={setPageCount}
          getFilteredOrders={getFilteredOrders}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          handleClearSearch={handleClearSearch}
          setSelectedOrder={setSelectedOrder}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      )}
    </>
  );
}

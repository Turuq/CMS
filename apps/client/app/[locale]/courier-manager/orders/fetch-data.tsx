import { CourierManagerOrders } from "@/utils/data/dummy";
import { OrderType } from "@/types/order";

export async function fetchData(
  options: {
    pageIndex: number;
    pageSize: number;
  },
  ordersTab: string,
) {
  // Fetch data based on the orderTab
  let data: {
    rows: OrderType[];
    pageCount: number;
    rowCount: number;
  } = {
    rows: [],
    pageCount: 0,
    rowCount: 0,
  };
  switch (ordersTab) {
    case "طرق":
    case "Turuq":
      data = {
        rows: CourierManagerOrders.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ) as OrderType[],
        pageCount: Math.ceil(CourierManagerOrders.length / options.pageSize),
        rowCount: CourierManagerOrders.length,
      };
    case "التكاملات":
    case "Integrations":
      data = {
        rows: CourierManagerOrders.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ) as OrderType[],
        pageCount: Math.ceil(CourierManagerOrders.length / options.pageSize),
        rowCount: CourierManagerOrders.length,
      };
    case "مستوردة":
    case "Imported":
      data = {
        rows: CourierManagerOrders.slice(
          options.pageIndex * options.pageSize,
          options.pageIndex * options.pageSize + options.pageSize,
        ) as OrderType[],
        pageCount: Math.ceil(CourierManagerOrders.length / options.pageSize),
        rowCount: CourierManagerOrders.length,
      };
  }

  return data;
}

// get order by OID
export async function getOrderByOID(OID: string, ordersTab: string) {
  // Fetch data based on the orderTab
  switch (ordersTab) {
    case "طرق":
    case "Turuq":
      return CourierManagerOrders.find(
        (order) => Number(order.OID) === Number(OID),
      );
    case "التكاملات":
    case "Integrations":
      return CourierManagerOrders.find(
        (order) => Number(order.OID) === Number(OID),
      );
    case "مستوردة":
    case "Imported":
      return CourierManagerOrders.find(
        (order) => Number(order.OID) === Number(OID),
      );
  }
}

export async function getFilteredOrders(
  filters: { [key: string]: string[] },
  pageIndex: number,
  pageSize: number,
  orderTab: string,
) {
  // Fetch data based on the orderTab
  let filteredOrders: OrderType[] = [];
  switch (orderTab) {
    case "طرق":
    case "Turuq":
      filteredOrders = CourierManagerOrders.filter((order) => {
        let isMatch = true;
        for (const key in filters) {
          if (filters[key].length > 0) {
            if (!filters[key].includes((order as any)[key])) {
              isMatch = false;
            }
          }
        }
        return isMatch;
      });
    case "التكاملات":
    case "Integrations":
      filteredOrders = CourierManagerOrders.filter((order) => {
        let isMatch = true;
        for (const key in filters) {
          if (filters[key].length > 0) {
            if (!filters[key].includes((order as any)[key])) {
              isMatch = false;
            }
          }
        }
        return isMatch;
      });
    case "مستوردة":
    case "Imported":
      filteredOrders = CourierManagerOrders.filter((order) => {
        let isMatch = true;
        for (const key in filters) {
          if (filters[key].length > 0) {
            if (!filters[key].includes((order as any)[key])) {
              isMatch = false;
            }
          }
        }
        return isMatch;
      });
  }

  const rows = filteredOrders.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  ) as OrderType[];
  const pageCount = Math.ceil(filteredOrders.length / pageSize);
  const rowCount = filteredOrders.length;
  return {
    rows,
    pageCount,
    rowCount,
  };
}

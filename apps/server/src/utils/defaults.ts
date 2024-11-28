export const stats = {
  delivered: 0,
  outForDelivery: 0,
  pending: 0,
  unreachable: 0,
  postponed: 0,
  cancelled: 0,
  returned: 0,
  collected: 0,
  outOfStock: 0,
  processing: 0,
  invalidAddress: 0,
  total: 0,
};

export const defaultOrderStatistics = {
  turuqOrders: stats,
  integrationOrders: {
    shopify: stats,
    woocommerce: stats,
  },
};

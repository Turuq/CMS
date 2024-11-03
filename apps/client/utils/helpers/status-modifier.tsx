import { OrderType } from '@/types/order';

export function getStatusColor(status: string) {
  let result = '';
  switch (status) {
    case 'delivered':
      result = 'bg-emerald-200 text-emerald-800';
      break;
    case 'outForDelivery':
      result = 'bg-sky-200 text-sky-800';
      break;
    case 'processing':
    case 'pending':
      result = 'bg-amber-200 text-amber-800';
      break;
    case 'cancelled':
    case 'postponed':
    case 'returned':
      result = 'bg-red-200 text-red-800';
      break;
    default:
      result = 'bg-gray-200 text-gray-800';
      break;
  }
  return result;
}

export function getStatusTextColor(status: string) {
  let result = '';
  switch (status) {
    case 'delivered':
      result = 'text-emerald-200 dark:text-emerald-200';
      break;
    case 'outForDelivery':
      result = 'text-sky-200 dark:text-sky-200';
      break;
    case 'processing':
    case 'pending':
      result = 'text-amber-200 dark:text-amber-200';
      break;
    case 'cancelled':
    case 'postponed':
    case 'returned':
    case 'invalidAddress':
      result = 'text-red-200 dark:text-red-200';
      break;
    default:
      result = 'text-gray-200 dark:text-gray-200';
      break;
  }
  return result;
}

export function getIndicatorColor(order: OrderType) {
  if (order?.toBeReshipped) return 'text-lime-500';
  if (order?.paymentMethod === 'INSTAPAY') return 'text-violet-500';
  if (order?.reshipped) return 'text-cyan-500';
  if (order?.gotGhosted) return 'text-red-500';
  if (order?.hasReturnedItems) return 'text-amber-500';
}

export function getStatusText(status: string) {
  switch (status) {
    case 'outForDelivery':
      return 'out for delivery';
    case 'outOfStock':
      return 'out of stock';
    case 'invalidAddress':
      return 'invalid address';
    default:
      return status;
  }
}

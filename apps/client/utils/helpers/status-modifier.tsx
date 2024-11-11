import { OrderType } from '@/types/order';

export function getStatusColor(status: string) {
  let result = '';
  switch (status) {
    case 'delivered':
      result = 'border-emerald-200 bg-emerald-200 text-emerald-200';
      break;
    case 'outForDelivery':
      result = 'border-sky-200 bg-sky-200 text-sky-200';
      break;
    case 'processing':
    case 'pending':
      result = 'border-amber-200 bg-amber-200 text-amber-200';
      break;
    case 'cancelled':
    case 'postponed':
    case 'returned':
      result = 'border-red-200 bg-red-200 text-red-200';
      break;
    default:
      result = 'border-gray-200 bg-gray-200 text-gray-200';
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

export function getStatusTrackerColor(status: string) {
  switch (status) {
    case 'delivered':
      return 'emerald';
    case 'outForDelivery':
      return 'sky';
    case 'processing':
    case 'pending':
      return 'amber';
    case 'cancelled':
    case 'postponed':
    case 'returned':
    case 'invalidAddress':
      return 'red';
    default:
      return 'gray';
  }
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

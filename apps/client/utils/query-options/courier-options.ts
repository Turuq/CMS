import { getCouriersWithStatistics } from '@/app/actions/courier-actions';

export const getCouriersOptions = {
  queryKey: ['get-couriers-with-statistics'],
  queryFn: async () => getCouriersWithStatistics(),
};

'use client';

import { getCouriers } from '@/app/actions/courier-actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '../ui/skeleton';
import { FilterObject } from '@/api/utils/validation';

interface CourierFilterProps {
  courierFilter: string | undefined;
  onCourierChange: (courier: string) => void;
  onServerColumnFilterChange: Dispatch<SetStateAction<FilterObject>>;
}

export default function CourierFilter({
  courierFilter,
  onCourierChange,
  onServerColumnFilterChange,
}: CourierFilterProps) {
  const t = useTranslations(
    'courierManager.tabs.orders.ordersTable.filters.courier'
  );
  //   Fetch Couriers
  const {
    data: couriers,
    error,
    isPending,
  } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: () => getCouriers(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }

  function filterByCourier(courier: string) {
    onCourierChange(courier);
    onServerColumnFilterChange((columns) =>
      Object.keys(columns) ? { ...columns, courier } : { courier }
    );
  }

  return (
    <>
      {isPending ? (
        <Skeleton className="w-36 lg:w-40 h-8 rounded-xl p-2" />
      ) : (
        <Select value={courierFilter} onValueChange={filterByCourier}>
          <SelectTrigger
            className={`rounded-xl capitalize text-xs font-semibold bg-muted/50 p-2 hover:bg-muted w-40 h-8 border-none`}
          >
            <SelectValue
              className="capitalize"
              placeholder={t('placeholder')}
            />
          </SelectTrigger>
          <SelectContent>
            {couriers ? (
              couriers.map((courier) => (
                <SelectItem
                  key={courier._id}
                  value={courier._id}
                  className="capitalize"
                >
                  <span>{courier.name}</span>
                </SelectItem>
              ))
            ) : (
              <p>No Couriers Found</p>
            )}
          </SelectContent>
        </Select>
      )}
    </>
  );
}

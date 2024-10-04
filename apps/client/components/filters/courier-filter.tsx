'use client';

import { api } from '@/app/actions/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';

interface CourierFilterProps {
  courierFilter: string | undefined;
  onCourierChange: (courier: string) => void;
  onServerColumnFilterChange: Dispatch<SetStateAction<ColumnFiltersState>>;
}

async function getCouriers() {
  const res = await api.courier.$get();
  if (!res.ok) {
    toast.error('Failed to get couriers');
    return;
  }
  const data = await res.json();
  return data;
}

export default function CourierFilter({
  courierFilter,
  onCourierChange,
  onServerColumnFilterChange,
}: CourierFilterProps) {
  //   Fetch Couriers
  const {
    data: couriers,
    error,
    isPending,
  } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: getCouriers,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }

  function filterByCourier(courier: string) {
    onCourierChange(courier);
    onServerColumnFilterChange((columns) => [
      ...columns,
      { id: 'courier', value: courier },
    ]);
  }

  return (
    <>
      {isPending ? (
        <Skeleton className="w-36 lg:w-40 h-8 rounded-xl p-2" />
      ) : (
        <Select value={courierFilter} onValueChange={filterByCourier}>
          <SelectTrigger
            className={`rounded-xl text-xs font-semibold bg-muted/50 p-2 hover:bg-muted w-40 h-8 border-none`}
          >
            <SelectValue placeholder={`Select Courier`} />
          </SelectTrigger>
          <SelectContent>
            {couriers ? (
              couriers.map((courier) => (
                <SelectItem
                  key={courier.id}
                  value={courier.name}
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

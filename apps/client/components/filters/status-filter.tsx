import { data } from '@/utils/status';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';
import { FilterObject } from '@/utils/validation/filters';

interface StatusFilterProps {
  onServerColumnFilterChange: Dispatch<SetStateAction<FilterObject>>;
  statusFilter: string | undefined;
  onStatusChange: (courier: string) => void;
}

export default function StatusFilter({
  onServerColumnFilterChange,
  statusFilter,
  onStatusChange,
}: StatusFilterProps) {
  const t = useTranslations(
    'courierManager.tabs.orders.ordersTable.filters.status'
  );

  function filterByStatus(status: string) {
    onStatusChange(status);
    onServerColumnFilterChange((columns) =>
      Object.keys(columns) ? { ...columns, status } : { status }
    );
  }

  return (
    <Select value={statusFilter} onValueChange={filterByStatus}>
      <SelectTrigger
        className={`rounded-xl text-xs font-semibold bg-muted/50 p-2 hover:bg-muted w-40 h-8 border-none`}
      >
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {data.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
            className="capitalize"
          >
            <span>{status.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

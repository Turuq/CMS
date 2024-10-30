"use client";

import { usePathname, useRouter } from '@/lib/navigation';
import { Locale } from '@/types/locale';
import { useParams } from 'next/navigation';
import { ReactNode, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { icons } from '../icons/icons';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: Locale) {
    const nextLocale = value;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select
      // className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6"
      value={defaultValue}
      disabled={isPending}
      onValueChange={onSelectChange}
    >
      <SelectTrigger className="w-auto group flex items-center justify-start gap-5 bg-transparent border-none">
        {icons.localeSwitcher}
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-light dark:bg-dark border-light_border dark:border-dark_border">
        {children}
      </SelectContent>
    </Select>
  );
}

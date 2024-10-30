'use client';

import { icons } from '@/components/icons/icons';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useClerk } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';

export default function SettingsMenu({
  isExpanded,
  locale,
}: {
  isExpanded: boolean;
  locale: string;
}) {
  const tNav = useTranslations('navigation');
  const { signOut } = useClerk();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 justify-self-end text-red-500 p-2">
          {icons['settings']}
          {isExpanded && (
            <p className="text-sm font-semibold capitalize">
              {tNav('settings')}
            </p>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandList>
            <CommandGroup heading="Settings">
              <CommandItem>
                <button
                  onClick={() => signOut({ redirectUrl: `/${locale}` })}
                  className="flex items-center text-red-500"
                >
                  {icons.logout}
                  <p className="text-xs font-bold ml-2">{tNav('signOut')}</p>
                </button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

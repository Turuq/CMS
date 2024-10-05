'use client';

import { Separator } from '@/components/ui/separator';
import { courierManagerLinks } from '@/utils/courier-manager-links';
import { PanelLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { courierManagerIcons } from '../icons/courier-manager-icons';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { icons } from '@/components/icons/icons';
import { useTranslations } from 'next-intl';

export default function CourierManagerSidebar({ locale }: { locale: string }) {
  // Translating page using next-intl --> client side
  const t = useTranslations('courierManager.tabs');
  const tNav = useTranslations('navigation');

  const [isExpanded, toggleExpand] = useState<boolean>(true);

  const pathname = usePathname();

  return (
    <div
      className={`${
        isExpanded && 'min-w-52'
      } flex flex-col justify-between px-2 gap-2 ${locale === 'ar' ? 'border-l' : 'border-r'} border-dark_border/20 dark:border-muted`}
    >
      <div className="flex flex-col gap-2">
        <button className="p-2" onClick={() => toggleExpand(!isExpanded)}>
          <PanelLeftIcon
            size={16}
            className="text-muted-foreground"
            strokeWidth={2}
          />
        </button>
        <Separator />
        <Link href={`/${locale}/courier-manager`}>
          <div
            className={`flex items-center gap-2 ${
              pathname.endsWith('/courier-manager')
                ? 'text-accent cursor-default'
                : 'text-muted-foreground'
            } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent`}
          >
            {icons['home']}
            {isExpanded && (
              <p className="text-sm font-semibold">{t('home.header')}</p>
            )}
          </div>
        </Link>
        <Separator />
        {courierManagerLinks.map((link) => (
          <Link key={link.title} href={`/${locale}${link.href}`}>
            <div
              className={`flex items-center gap-2 ${
                pathname.endsWith(link.path)
                  ? 'text-accent cursor-default'
                  : 'text-muted-foreground'
              } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent`}
            >
              {courierManagerIcons[link.icon]}
              {isExpanded && (
                <p className="text-sm font-semibold capitalize">
                  {t(`${link.title}.header`)}
                </p>
              )}
            </div>
          </Link>
        ))}
        <Separator />
      </div>
      <button className="flex items-center gap-2 justify-self-end text-red-500 p-2">
        {icons.settings}
        {isExpanded && (
          <p className="text-sm font-semibold">{tNav('settings')}</p>
        )}
      </button>
    </div>
  );
}

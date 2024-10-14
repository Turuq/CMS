'use client';

import { icons } from '@/components/icons/icons';
import { Separator } from '@/components/ui/separator';
import { courierManagerLinks } from '@/utils/courier-manager-links';
import { PanelLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { courierManagerIcons } from '../icons/courier-manager-icons';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function CourierManagerSidebar({ locale }: { locale: string }) {
  // Translating page using next-intl --> client side
  const t = useTranslations('courierManager.tabs');
  const tNav = useTranslations('navigation');

  const [open, setOpen] = useState<boolean>(false);
  const [isExpanded, toggleExpand] = useState<boolean>(true);

  const pathname = usePathname();

  return (
    <div className="lg:h-svh">
      <div
        className={`${
          isExpanded && 'min-w-52'
        } bg-light dark:bg-dark_border py-5 h-full rounded-xl hidden lg:flex flex-col justify-between px-2 gap-2`}
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
      {/* Small Screen Navigation */}
      <div className="lg:hidden flex items-center justify-start">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <PanelLeftIcon
              size={16}
              className="text-muted-foreground"
              strokeWidth={2}
            />
          </SheetTrigger>
          <SheetContent
            side={locale === 'ar' ? 'right' : 'left'}
            className="w-auto h-[400px] m-5 rounded-xl self-center flex flex-col items-center"
          >
            <div className="flex flex-col gap-2 mt-10">
              <Link
                href={`/${locale}/courier-manager`}
                onClick={() => setOpen(false)}
              >
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
                <Link
                  key={link.title}
                  href={`/${locale}${link.href}`}
                  onClick={() => setOpen(false)}
                >
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
            <button className="flex items-center gap-2 justify-self-end text-red-500 p-2 mt-5">
              {icons.settings}
              {isExpanded && (
                <p className="text-sm font-semibold">{tNav('settings')}</p>
              )}
            </button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

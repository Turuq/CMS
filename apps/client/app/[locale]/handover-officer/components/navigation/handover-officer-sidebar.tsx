'use client';

import { Separator } from '@/components/ui/separator';
import { handoverOfficerLinks } from '@/utils/handover-officer-links';
import { PanelLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { handoverOfficerIcons } from '../icons/handover-officer-icons';
import { icons } from '@/components/icons/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import SettingsMenu from './settings-menu';

export default function HandoverOfficerSidebar({ locale }: { locale: string }) {
  const t = useTranslations('handoverOfficer.tabs');

  const [isExpanded, toggleExpand] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);

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
          <Link href={`/${locale}/handover-officer`}>
            <div
              className={`flex items-center gap-2 ${
                pathname.endsWith('/handover-officer')
                  ? 'text-accent cursor-default'
                  : 'text-muted-foreground'
              } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent`}
            >
              {icons['home']}
              {isExpanded && (
                <p className="text-sm font-semibold capitalize">
                  {t('home.header')}
                </p>
              )}
            </div>
          </Link>
          <Separator />
          {handoverOfficerLinks.map((link) => (
            <Link key={link.title} href={`/${locale}${link.href}`}>
              <div
                className={`flex items-center gap-2 ${
                  pathname.includes(link.path)
                    ? 'text-accent cursor-default'
                    : 'text-muted-foreground'
                } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent`}
              >
                {handoverOfficerIcons[link.icon]}
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
        <SettingsMenu isExpanded={isExpanded} locale={locale} />
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
              {handoverOfficerLinks.map((link) => (
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
                    {handoverOfficerIcons[link.icon]}
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
            <SettingsMenu isExpanded={isExpanded} locale={locale} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

'use client';

import { PanelLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { icons } from '../icons/icons';
import SettingsMenu from '@/app/[locale]/handover-officer/components/navigation/settings-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface ISidebar {
  locale: string;
  variant: 'courier-manager' | 'handover-officer' | 'assignment-officer';
  tKey: 'courierManager' | 'handoverOfficer' | 'assignmentOfficer';
  links: { title: string; href: string; path: string; icon: string }[];
  iconPack: { [key: string]: JSX.Element };
}

export default function Sidebar({
  locale,
  tKey,
  variant,
  links,
  iconPack,
}: ISidebar) {
  const t = useTranslations(`${tKey}.tabs`);

  const [open, setOpen] = useState<boolean>(false);
  const [isExpanded, toggleExpand] = useState<boolean>(true);

  const pathname = usePathname();

  return (
    <div className="lg:h-svh">
      <motion.div
        animate={{ width: isExpanded ? '13rem' : '3rem' }}
        transition={{ duration: 1, ease: 'anticipate' }}
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
          <Link href={`/${locale}/${variant}`}>
            <div
              className={`flex items-center gap-2 ${
                pathname.endsWith(`/${variant}`)
                  ? 'text-accent cursor-default'
                  : 'text-muted-foreground'
              } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent group`}
            >
              {icons['home']}
              {isExpanded && (
                <p className="text-sm font-semibold">{t('home.header')}</p>
              )}
            </div>
          </Link>
          <Separator />
          {links.map((link) => (
            <Link key={link.title} href={`/${locale}${link.href}`}>
              <div
                className={`flex items-center gap-2 ${
                  pathname.includes(link.path) &&
                  pathname !== `/${locale}/${variant}`
                    ? 'text-accent cursor-default'
                    : 'text-muted-foreground'
                } hover:bg-light dark:hover:bg-muted/10 p-2 rounded-xl hover:text-accent group`}
              >
                {iconPack[link.icon]}
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
      </motion.div>
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
            <div className="flex flex-col gap-2 mt-10 group">
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
              {links.map((link) => (
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
                    {iconPack[link.icon]}
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

import LocaleSwitcher from '@/components/locale/locale-switcher';
import Navbar from '@/components/navigation/navbar';
import ThemeToggle from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import { DictionaryProvider } from '@/providers/dictionary-provider';
import TanStackQueryProvider from '@/providers/tanstack-query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import 'moment/min/locales';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Montserrat, Cairo } from 'next/font/google';
import { getDictionary } from '../dictionaries';
import '../globals.css';
import { Separator } from '@/components/ui/separator';
import { DotIcon } from 'lucide-react';
import { ws } from '../actions/api';
import { ClerkProvider } from '@clerk/nextjs';
import moment from 'moment';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const cairo = Cairo({
  weight: ['200', '300', '400', '600', '700', '900'],
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  title: 'Turuq | CMS',
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${locale === 'ar' ? cairo.className : montserrat.className} bg-light_border dark:bg-dark h-full`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ClerkProvider>
            <TanStackQueryProvider>
              <NextIntlClientProvider messages={messages}>
                <DictionaryProvider dictionary={dict} locale={locale}>
                  <div className="flex flex-col justify-between gap-5">
                    <Navbar locale={locale} />
                    <div className="rounded-md bg-light_border dark:bg-dark h-full px-5">
                      {children}
                      <Toaster />
                    </div>
                    <footer className="flex flex-col-reverse lg:flex-row items-center justify-between rounded-xl m-5 gap-5 p-5 bg-light dark:bg-dark_border">
                      <div className="flex items-center gap-1">
                        <div
                          className={`${ws.OPEN ? 'text-emerald-500' : ws.CONNECTING ? 'text-amber-500' : 'text-red-500'} flex items-center gap-1`}
                        >
                          <DotIcon size={24} className={'text-inherit'} />
                        </div>
                        <p className="font-semibold text-[10px] text-dark_border/80 dark:text-light_border/80">
                          Copyright © {moment().locale('en').format('YYYY')}{' '}
                          Turuq. All Rights Reserved.
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <ThemeToggle />
                        <Separator
                          orientation="vertical"
                          className="bg-dark_border/20 dark:bg-light/20 h-5"
                        />
                        <LocaleSwitcher />
                      </div>
                    </footer>
                  </div>
                </DictionaryProvider>
              </NextIntlClientProvider>
            </TanStackQueryProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

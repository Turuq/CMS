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
  console.log('locale===========', locale);
  const messages = await getMessages();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${locale === 'ar' ? cairo.className : montserrat.className} bg-light_border dark:bg-dark`}
        // style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <TanStackQueryProvider>
            <NextIntlClientProvider messages={messages}>
              <DictionaryProvider dictionary={dict} locale={locale}>
                <div className="grid grid-cols-12">
                  <Navbar locale={locale} />
                  {/* <Sidebar /> */}
                  <div className="col-span-12 p-5">
                    <div className="rounded-md bg-light_border dark:bg-dark">
                      {children}
                      <Toaster />
                    </div>
                    <footer className="flex items-center justify-end gap-10 p-5 bg-light_border dark:bg-dark">
                      <ThemeToggle />
                      <LocaleSwitcher />
                    </footer>
                  </div>
                </div>
              </DictionaryProvider>
            </NextIntlClientProvider>
          </TanStackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const t = await getTranslations('authentication');
  return (
    <div className="flex flex-col items-center justify-center gap-20">
      <div className="bg-light dark:bg-muted rounded-xl w-auto h-[60svh] p-2 shadow-md dark:shadow-light_border/10 shadow-dark_border/30">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">{t('login.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('login.description')}
            </p>
            <div className="flex flex-col gap-5 my-5 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="username">{t('login.fields.username')}</label>
                <Input
                  id="username"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('login.placeholders.username')}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="password">{t('login.fields.password')}</label>
                <Input
                  id="password"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('login.placeholders.password')}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t('login.buttons.login')}
            </Button>
          </div>
          <div className="flex flex-col gap-5 items-center justify-center">
            <span className="text-sm">
              {t('dontHaveAnAccount')}
              <Link
                href="/sign-up"
                className="underline hover:text-accent font-semibold mx-0.5"
              >
                {t('signup.header')}
              </Link>
            </span>
          </div>
        </div>
      </div>
      <Separator />
      
    </div>
  );
}

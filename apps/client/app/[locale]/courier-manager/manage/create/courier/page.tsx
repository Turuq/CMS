'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CreateNewCourier() {
  const t = useTranslations('authentication');
  return (
    <div className="flex items-center justify-center">
      <div className="bg-light dark:bg-muted rounded-xl w-1/2 h-full p-2 shadow-md dark:shadow-light_border/10 shadow-dark_border/30">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">{t('signup.courier.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('signup.courier.description')}
            </p>
            <div className="grid grid-cols-4 gap-5 my-5 w-full">
              <div className="flex flex-col col-span-4 lg:col-span-2 gap-2 w-full">
                <label htmlFor="name">{t('signup.fields.name')}</label>
                <Input
                  id="name"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.name')}
                />
              </div>
              <div className="flex flex-col col-span-4 lg:col-span-2 gap-2 w-full">
                <label htmlFor="username">{t('signup.fields.username')}</label>
                <Input
                  id="username"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.username')}
                />
              </div>
              <div className="col-span-4 lg:col-span-3 flex flex-col gap-2 w-full">
                <label htmlFor="email">{t('signup.fields.email')}</label>
                <Input
                  id="email"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.email')}
                />
              </div>
              <div className="col-span-4 lg:col-span-1 flex items-center justify-center gap-2 w-full h-full">
                <Switch id="outsourced" />
                <Label htmlFor="outsourced">Outsourced</Label>
              </div>
              <div className="col-span-4 lg:col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor="phone">{t('signup.fields.phone')}</label>
                <Input
                  id="phone"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.phone')}
                />
              </div>
              <div className="col-span-4 lg:col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor="nationalId">
                  {t('signup.fields.nationalId')}
                </label>
                <Input
                  id="nationalId"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.nationalId')}
                />
              </div>
              <div className="flex flex-col col-span-4 lg:col-span-2 gap-2 w-full">
                <label htmlFor="zone">{t('signup.fields.zone')}</label>
                <Input
                  id="zone"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.zone')}
                />
              </div>
              <div className="flex flex-col col-span-4 lg:col-span-2 gap-2 w-full">
                <label htmlFor="password">{t('signup.fields.password')}</label>
                <Input
                  id="password"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.password')}
                />
              </div>
              <div className="col-span-4 flex flex-col gap-2 w-full">
                <label htmlFor="nationalIdImage">
                  {t('signup.fields.nationalIdImage')}
                </label>
                <Input
                  type="file"
                  id="nationalIdImage"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.nationalIdImage')}
                />
              </div>{' '}
              <div className="col-span-4 flex flex-col gap-2 w-full">
                <label htmlFor="driverLicenseImage">
                  {t('signup.fields.driverLicenseImage')}
                </label>
                <Input
                  type="file"
                  id="driverLicenseImage"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.driverLicenseImage')}
                />
              </div>{' '}
              <div className="col-span-4 flex flex-col gap-2 w-full">
                <label htmlFor="criminalRecordImage">
                  {t('signup.fields.criminalRecordImage')}
                </label>
                <Input
                  type="file"
                  id="criminalRecordImage"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.criminalRecordImage')}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {t('signup.buttons.signup')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

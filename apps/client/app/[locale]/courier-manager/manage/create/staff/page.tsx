'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CreateNewStaffMember() {
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
            <h1 className="font-bold text-lg">{t('signup.staff.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('signup.staff.description')}
            </p>
            <div className="grid grid-cols-2 gap-5 my-5 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name">{t('signup.fields.name')}</label>
                <Input
                  id="name"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.name')}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="username">{t('signup.fields.username')}</label>
                <Input
                  id="username"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.username')}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor="email">{t('signup.fields.email')}</label>
                <Input
                  id="email"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.email')}
                />
              </div>
              <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                <label htmlFor="phone">{t('signup.fields.phone')}</label>
                <Input
                  id="phone"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.phone')}
                />
              </div>
              <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                <label htmlFor="nationalId">
                  {t('signup.fields.nationalId')}
                </label>
                <Input
                  id="nationalId"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.nationalId')}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="role">{t('signup.fields.role.label')}</label>
                <Select>
                  <SelectTrigger className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none">
                    <SelectValue placeholder={t('signup.placeholders.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HANDOVER_OFFICER">
                      {t('signup.fields.role.handover')}
                    </SelectItem>
                    <SelectItem value="ASSIGNMENT_OFFICER">
                      {t('signup.fields.role.assignment')}
                    </SelectItem>
                    <SelectItem value="COURIER_MANAGER">
                      {t('signup.fields.role.manager')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="password">{t('signup.fields.password')}</label>
                <Input
                  id="password"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.password')}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor="nationalIdImage">
                  {t('signup.fields.nationalIdImage')}
                </label>
                <Input
                  type="file"
                  id="nationalIdImage"
                  className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                  placeholder={t('signup.placeholders.nationalIdImage')}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2 w-full">
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

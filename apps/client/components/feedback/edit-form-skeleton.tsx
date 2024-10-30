import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useTranslations } from 'next-intl';

export default function EditFormSkeleton() {
  const t = useTranslations('forms.edit.staff');
  return (
    <div className="flex items-center justify-center">
      <div className="bg-light dark:bg-dark_border rounded-xl w-1/2 h-full p-2">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">{t('header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('description')}
            </p>
            <div className="grid grid-cols-2 gap-5 my-5 w-full">
              <div>
                <div className="flex flex-col gap-2 w-full">
                  <label>{t('fields.name')}</label>
                  <Skeleton className="rounded-xl w-full h-10" />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>{t('fields.username')}</label>
                <Skeleton className="rounded-xl w-full h-10" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>{t('fields.email')}</label>
                <Skeleton className="rounded-xl w-full h-10" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>{t('fields.phone')}</label>
                <Skeleton className="rounded-xl w-full h-10" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>{t('fields.nationalId')}</label>
                <Skeleton className="rounded-xl w-full h-10" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>{t('fields.role')}</label>
                <Skeleton className="rounded-xl w-full h-10" />
              </div>
              <div className="col-span-2 grid grid-cols-1 items-center gap-5">
                <div className="grid grid-cols-3 items-center gap-5">
                  <div className="col-span-2 flex flex-col gap-2">
                    <label htmlFor="nationalIdImage">
                      {t('fields.nationalIdImage')}
                    </label>
                    <Skeleton className="rounded-xl w-full h-20" />
                  </div>
                  <div
                    className={`col-span-1 flex items-center justify-center bg-light_border dark:bg-muted rounded-xl size-40`}
                  >
                    <Skeleton className="rounded-xl size-40" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-5">
                  <div className="col-span-2 flex flex-col gap-2">
                    <label htmlFor="nationalIdImage">
                      {t('fields.criminalRecordImage')}
                    </label>
                    <Skeleton className="rounded-xl w-full h-20" />
                  </div>
                  <div
                    className={`col-span-1 flex items-center justify-center bg-light_border dark:bg-muted rounded-xl size-40`}
                  >
                    <Skeleton className="rounded-xl size-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

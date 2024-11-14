import { api } from '@/app/actions/api';
import CourierCardLayout from '../components/layouts/courier-card-layout';
import { getTranslations } from 'next-intl/server';

export default async function HandOver({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const res = await api.courier.withStatistics.$get();
  const couriers = await res.json();

  const t = await getTranslations('handoverOfficer.tabs.handOver');

  return (
    <div className="lg:p-2 w-full">
      <h1 className="font-bold text-lg text-foreground">{t('header')}</h1>
      <p className="text-sm font-semibold text-foreground/50">
        {t('description')}
      </p>
      <CourierCardLayout locale={locale} initial={couriers} />
    </div>
  );
}

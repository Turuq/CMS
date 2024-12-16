import { api } from '@/app/actions/api';
import { getTranslations } from 'next-intl/server';
import CourierCardLayout from '../../handover-officer/components/layouts/courier-card-layout';

export default async function Reshipped({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const res = await api.courier.withStatistics.$get();
  const couriers = await res.json();

  const t = await getTranslations('courierManager.tabs.reshipped');

  return (
    <div className="lg:p-2 w-full">
      <h1 className="font-bold text-lg text-foreground">{t('header')}</h1>
      <p className="text-sm font-semibold text-foreground/50">
        {t('description')}
      </p>
      <CourierCardLayout
        locale={locale}
        initial={couriers}
        href={'reshipped'}
        hrefOptions={{
          tooltip: 'Reship',
          label: 'reship',
        }}
      />
    </div>
  );
}

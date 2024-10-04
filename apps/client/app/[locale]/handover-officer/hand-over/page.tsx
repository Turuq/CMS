import { api } from '@/app/actions/api';
import CourierCardLayout from '../components/layouts/courier-card-layout';

export default async function HandOver({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const res = await api.courier.withStatistics.$get();
  const couriers = await res.json();

  return (
    <div className="lg:p-2 w-full">
      <h1 className="font-bold text-lg text-foreground">Hand Over</h1>
      <p className="text-sm font-semibold text-foreground/50">
        {'Please select a courier to hand-over orders to.'}
      </p>
      <CourierCardLayout locale={locale} initial={couriers} />
    </div>
  );
}

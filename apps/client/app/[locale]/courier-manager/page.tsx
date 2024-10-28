import Dashboard from '@/components/layout/dashboard';

export default async function CourierManagerHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <Dashboard locale={locale} />;
}

import Dashboard from '@/components/layout/dashboard';

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <Dashboard locale={locale} />;
}

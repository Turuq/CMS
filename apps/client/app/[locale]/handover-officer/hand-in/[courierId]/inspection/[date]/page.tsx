import Inspector from '@/components/pages/inspector-page';

export default function Page({
  params: { locale, courierId, date },
}: {
  params: { locale: string; courierId: string; date: string };
}) {
  return <Inspector locale={locale} courierId={courierId} date={date} />;
}

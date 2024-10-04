import Inspector from '@/components/pages/inspector-page';
import moment from 'moment';

export default function Page({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  return (
    <Inspector
      locale={locale}
      courierId={courierId}
      date={moment().toISOString()}
    />
  );
}

import BatchesLayout from '@/components/layout/batches';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <BatchesLayout locale={locale} />;
}

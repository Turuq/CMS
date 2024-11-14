'use client';

import Batch from '@/components/layout/batch';

export default function Page({
  params: { batchId, locale },
}: {
  params: { batchId: string; locale: string };
}) {
  return <Batch batchId={batchId} locale={locale} />;
}

'use client';

import EditCourierForm from '@/app/[locale]/courier-manager/components/forms/edit-courier-form';
import { getCourierById } from '@/app/actions/courier-actions';
import EditFormSkeleton from '@/components/feedback/edit-form-skeleton';
import { useQuery } from '@tanstack/react-query';

export default function EditCourierPage({
  params: { locale, courierId },
}: {
  params: { locale: string; courierId: string };
}) {
  const { data, error, isPending } = useQuery({
    queryKey: ['get-courier', courierId],
    queryFn: () => getCourierById({ id: courierId }),
  });

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }
  if (isPending) {
    return <EditFormSkeleton />;
  }
  return (
    <div>
      {data && <EditCourierForm locale={locale} defaultValues={data} />}
    </div>
  );
}

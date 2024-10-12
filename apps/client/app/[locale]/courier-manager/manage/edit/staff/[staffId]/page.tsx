'use client';

import EditStaffForm from '@/app/[locale]/courier-manager/components/forms/edit-staff-form';
import { getStaffById } from '@/app/actions/staff-actions';
import EditFormSkeleton from '@/components/feedback/edit-form-skeleton';
import { useQuery } from '@tanstack/react-query';

export default function EditStaffPage({
  params: { locale, staffId },
}: {
  params: { locale: string; staffId: string };
}) {
  const { data, error, isPending } = useQuery({
    queryKey: ['get-staff', staffId],
    queryFn: () => getStaffById(staffId),
  });

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }
  if (isPending) {
    return <EditFormSkeleton />;
  }
  return (
    <div>{data && <EditStaffForm locale={locale} defaultValues={data} />}</div>
  );
}

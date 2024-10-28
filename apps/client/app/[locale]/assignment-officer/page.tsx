import Dashboard from '@/components/layout/dashboard';

export default async function AssignmentOfficerHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <Dashboard locale={locale} />;
}

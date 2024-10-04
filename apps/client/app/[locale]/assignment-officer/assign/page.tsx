import CouriersCards from '../../courier-manager/assign/fetch-couriers';

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="w-full bg-light dark:bg-dark p-2 rounded-xl">
      <CouriersCards locale={locale} href={`assignment-officer`} />
    </div>
  );
}

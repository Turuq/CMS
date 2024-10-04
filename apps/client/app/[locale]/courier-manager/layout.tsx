import CourierManagerSidebar from './components/navigation/courier-manager-sidebar';

export default async function CourierManagerLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="flex gap-2 min-h-svh">
      <CourierManagerSidebar locale={locale} />
      <div className="w-full">{children}</div>
    </div>
  );
}

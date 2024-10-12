import { Metadata } from 'next';
import CourierManagerSidebar from './components/navigation/courier-manager-sidebar';

export const metadata: Metadata = {
  title: "Courier Manager"
}

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
      <div className="w-full mx-5">{children}</div>
    </div>
  );
}

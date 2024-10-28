import { Metadata } from 'next';
import Sidebar from '@/components/navigation/sidebar';
import { courierManagerLinks } from '@/utils/courier-manager-links';
import { courierManagerIcons } from './components/icons/courier-manager-icons';

export const metadata: Metadata = {
  title: 'Courier Manager',
};

export default async function CourierManagerLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 min-h-svh">
      <Sidebar
        locale={locale}
        tKey="courierManager"
        variant="courier-manager"
        links={courierManagerLinks}
        iconPack={courierManagerIcons}
      />
      <div className="w-full lg:mx-5">{children}</div>
    </div>
  );
}

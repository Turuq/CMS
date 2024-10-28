import { Metadata } from 'next';
import Sidebar from '@/components/navigation/sidebar';
import { handoverOfficerLinks } from '@/utils/handover-officer-links';
import { handoverOfficerIcons } from './components/icons/handover-officer-icons';

export const metadata: Metadata = {
  title: 'Turuq CMS | Handover Officer',
};

export default async function HandoverOfficerLayout({
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
        tKey="handoverOfficer"
        variant="handover-officer"
        links={handoverOfficerLinks}
        iconPack={handoverOfficerIcons}
      />
      <div className="w-full lg:mx-5">{children}</div>
    </div>
  );
}

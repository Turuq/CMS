import Sidebar from '@/components/navigation/sidebar';
import { assignmentOfficerLinks } from '@/utils/assignment-officer-links';
import { Metadata } from 'next';
import { assignmentOfficerIcons } from './components/icons/assignment-officer-icons';

export const metadata: Metadata = {
  title: 'Turuq CMS | Assignment Officer',
};

export default async function AssignmentOfficerLayout({
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
        tKey="assignmentOfficer"
        variant="assignment-officer"
        links={assignmentOfficerLinks}
        iconPack={assignmentOfficerIcons}
      />
      <div className="w-full lg:mx-5">{children}</div>
    </div>
  );
}

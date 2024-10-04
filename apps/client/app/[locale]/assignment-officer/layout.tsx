import { Metadata } from 'next';
import AssignmentOfficerSidebar from './components/assignment-officer-sidebar';

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
    <div className="flex justify-normal gap-2 min-h-svh">
      <AssignmentOfficerSidebar locale={locale} />
      {children}
    </div>
  );
}

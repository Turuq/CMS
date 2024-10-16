import { Metadata } from 'next';
import HandoverOfficerSidebar from './components/navigation/handover-officer-sidebar';

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
      <HandoverOfficerSidebar locale={locale} />
      <div className="w-full lg:mx-5">{children}</div>
    </div>
  );
}

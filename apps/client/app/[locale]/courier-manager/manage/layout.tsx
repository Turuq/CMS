import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Courier Manager | Manage',
};

export default function CourierManagerManageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

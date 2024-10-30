import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Courier Manager | Orders',
};

export default function CourierManagerOrderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

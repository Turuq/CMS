import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Courier Manager | Assign',
};

export default function CourierManagerAssignLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

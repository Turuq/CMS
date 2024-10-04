'use client';

import CourierCard from '@/components/cards/courier-card';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/actions/api';

async function getCouriers() {
  const res = await api.courier.$get();
  if (!res.ok) {
    throw new Error('Failed to get couriers');
  }
  const data = await res.json();
  return data;
}

interface ICouriersCardsProps {
  locale: string;
  href?: string;
}

export default function CouriersCards({
  locale,
  href = 'courier-manager',
}: ICouriersCardsProps) {
  const { error, data } = useQuery({
    queryKey: ['get-couriers'],
    queryFn: getCouriers,
  });

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>An Error Has Occurred: {error.message}</div>;
  }

  return (
    <>
      {data &&
        data.map((courier) => (
          <CourierCard
            key={courier.id}
            courier={courier}
            href={`/${locale}/${href}/assign/${courier.id}`}
            locale={locale}
          />
        ))}
    </>
  );
}

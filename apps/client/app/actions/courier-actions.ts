'use server';

import { getToken } from '@/utils/helpers/getToken';
import { redirect } from 'next/navigation';
import { api } from './api';

export async function getGroupedCouriers() {
  const token = getToken();

  if (!token) {
    redirect('/');
  }

  const res = await api.courier.grouped.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get couriers');
  }
  const data = await res.json();
  return data;
}

export async function getCouriers() {
  const token = getToken();

  if (!token) {
    redirect('/');
  }
  const res = await api.courier.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get couriers');
  }
  const data = await res.json();
  return data;
}

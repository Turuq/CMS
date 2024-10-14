'use server';

import { verifyToken } from '@/utils/helpers/get-token';
import { api } from './api';
import moment from 'moment';

export async function hasActiveBatch({ id }: { id: string }) {
  const token = verifyToken();
  const res = await api.batch.courier[':id'].$get(
    { param: { id } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return data.hasActiveBatch;
}

export async function startBatch({
  courierId,
  orderIds,
  integrationIds,
}: {
  courierId: string;
  orderIds: string[];
  integrationIds: string[];
}) {
  const token = verifyToken();
  const res = await api.batch.$post(
    {
      json: {
        courier: courierId,
        orders: orderIds,
        integrationOrders: integrationIds,
        startDate: moment().format('YYYY-MM-DD'),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return data;
}

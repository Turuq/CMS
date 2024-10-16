'use server';

import { CourierBatchSummary } from '@/api/validation/courier-batch';
import { verifyToken } from '@/utils/helpers/get-token';
import moment from 'moment';
import { api } from './api';
import { OrderType } from '@/types/order';

export async function hasActiveBatch({ id }: { id: string }) {
  const token = verifyToken();
  const res = await api.batch.courier.active[':id'].$get(
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

export async function getAllBatches() {
  const token = verifyToken();
  const res = await api.batch.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch batches: ${res.statusText}`);
  }
  const data: CourierBatchSummary[] = await res.json();
  return data;
}

export async function getBatchById(id: string) {
  const token = verifyToken();
  const res = await api.batch[':id'].$get(
    { param: { id } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch batch: ${res.statusText}`);
  }
  const data: CourierBatchSummary & {
    orders: OrderType[];
    integrationOrders: OrderType[];
  } = await res.json();
  return data;
}

export async function checkHasOutstanding(id: string) {
  const token = verifyToken();
  const res = await api.batch.outstanding[':id'].$get(
    {
      param: { id },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to check outstanding: ${res.statusText}`);
  }
  const data = await res.json();
  console.log('outstanding', data);
  return data ? data.hasOutstanding : false;
}

export async function endBatch(id: string) {
  const token = verifyToken();
  const res = await api.batch.end[':id'].$put(
    {
      param: { id },
      json: { endDate: moment().format('YYYY-MM-DD') },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to end batch: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

export async function getCourierBatches(id: string) {
  const token = verifyToken();
  const res = await api.batch.courier[':id'].$get(
    {
      param: { id },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch courier batches: ${res.statusText}`);
  }
  const data: CourierBatchSummary[] = await res.json();
  return data;
}
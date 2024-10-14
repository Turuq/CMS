'use server';

import { verifyToken } from '@/utils/helpers/get-token';
import { api } from './api';
import { FilterObject } from '@/api/utils/validation';
import { OrderType } from '@/types/order';

export async function getTuruqOrders({
  page,
  pageSize,
  conditions,
}: {
  page: string;
  pageSize: string;
  conditions: FilterObject;
}) {
  const token = verifyToken();

  const res = await api.order.turuq[':page'][':pageSize'].$post(
    {
      param: { page, pageSize },
      json: conditions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export async function getIntegrationOrders({
  page,
  pageSize,
  conditions,
}: {
  page: string;
  pageSize: string;
  conditions: FilterObject;
}) {
  const token = verifyToken();

  const res = await api.order.integration[':page'][':pageSize'].$post(
    {
      param: { page, pageSize },
      json: conditions,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export async function getProcessingUnassignedTuruqOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const token = verifyToken();

  const res = await api.order.turuq.processing.unassigned[':page'][
    ':pageSize'
  ].$get(
    { param: { page: page, pageSize: pageSize } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export async function getProcessingUnassignedIntegrationOrders({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  const token = verifyToken();

  const res = await api.order.integration.processing.unassigned[':page'][
    ':pageSize'
  ].$get(
    { param: { page: page, pageSize: pageSize } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data = await res.json();
  return data;
}

export async function getCourierAssignedOrders({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: string;
  pageSize: string;
}) {
  const token = verifyToken();
  const res = await api.order.turuq.assigned[':id'][':page'][':pageSize'].$get(
    { param: { id, page, pageSize } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data: { orders: OrderType[]; totalPages: number } = await res.json();
  return data;
}

export async function getCourierAssignedIntegrationOrders({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: string;
  pageSize: string;
}) {
  const token = verifyToken();
  const res = await api.order.integration.assigned[':id'][':page'][
    ':pageSize'
  ].$get(
    { param: { id, page, pageSize } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get orders');
  }
  const data: { integrationOrders: OrderType[]; totalPages: number } =
    await res.json();
  return data;
}

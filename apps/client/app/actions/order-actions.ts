'use server';

import { getToken } from '@/utils/helpers/getToken';
import { FilterObject } from '@/utils/validation/filters';
import { redirect } from 'next/navigation';
import { api } from './api';

export async function getTuruqOrders({
  page,
  pageSize,
  conditions,
}: {
  page: string;
  pageSize: string;
  conditions: FilterObject;
}) {
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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

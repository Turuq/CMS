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
  const token = await verifyToken();

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
  const token = await verifyToken();

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
  const token = await verifyToken();

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
  const token = await verifyToken();

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
  const token = await verifyToken();
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
  const data = (await res.json()) as {
    orders: OrderType[];
    totalPages: number;
  };
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
  const token = await verifyToken();
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

export async function getCourierToBeReshippedOrders({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: string;
  pageSize: string;
}) {
  const token = await verifyToken();
  const res = await api.order.turuq.assigned.reshipped[':id'][':page'][
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
  const data = (await res.json()) as {
    orders: OrderType[];
    totalPages: number;
  };
  return data;
}

export async function getCourierToBeReshippedIntegrationOrders({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: string;
  pageSize: string;
}) {
  const token = await verifyToken();
  const res = await api.order.integration.assigned.reshipped[':id'][':page'][
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

export async function assignTuruqOrders({
  id,
  ids,
}: {
  id: string;
  ids: string[];
}) {
  const res = await api.order.turuq.assign[':id'].$put({
    param: { id },
    json: { ids },
  });
  if (!res.ok) {
    return { error: 'Failed to assign orders' };
  }
  const data = await res.json();
  return { data };
}

export async function assignIntegrationOrders({
  id,
  ids,
}: {
  id: string;
  ids: string[];
}) {
  const res = await api.order.integration.assign[':id'].$put({
    param: { id },
    json: { ids },
  });
  if (!res.ok) {
    return { error: 'Failed to assign orders' };
  }
  const data = await res.json();
  return { data };
}

export async function reshipTuruqOrders({
  courierId,
  ids,
}: {
  courierId: string;
  ids: string[];
}) {
  const token = await verifyToken();
  const res = await api.order.turuq.reship[':id'].$put(
    {
      param: { id: courierId },
      json: { ids },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to reship orders');
  }
  const data = await res.json();
  return data;
}

export async function reshipIntegrationOrders({
  courierId,
  ids,
}: {
  courierId: string;
  ids: string[];
}) {
  const token = await verifyToken();
  const res = await api.order.integration.reship[':id'].$put(
    {
      param: { id: courierId },
      json: { ids },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to reship orders');
  }
  const data = await res.json();
  return data;
}
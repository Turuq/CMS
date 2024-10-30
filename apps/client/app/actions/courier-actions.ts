'use server';

import { verifyToken } from '@/utils/helpers/get-token';
import { api } from './api';
import { Courier, CreateCourier } from '@/api/validation/courier';
import { EditCourier } from '@/utils/validation/courier';

export async function getGroupedCouriers() {
  const token = await verifyToken();

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

export async function getCouriersWithStatistics() {
  const token = await verifyToken();

  const res = await api.courier.withStatistics.$get(
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
  const token = await verifyToken();

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
  const data: Courier[] = await res.json();
  return data;
}

export async function getCourierById({ id }: { id: string }) {
  const token = await verifyToken();

  const res = await api.courier[':id'].$get(
    { param: { id } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get courier');
  }
  const data: Courier = await res.json();
  return data;
}

export async function activateCourier({
  id,
  salary,
  commissionPerOrder,
  zone,
}: {
  id: string;
  salary: number;
  commissionPerOrder: number;
  zone: string;
}) {
  const token = await verifyToken();

  const res = await api.courier.activate[':id'].$put(
    { param: { id }, json: { salary, commissionPerOrder, zone } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to activate courier');
  }
  const data = await res.json();
  return data;
}

export async function deactivateCourier({ id }: { id: string }) {
  const token = await verifyToken();

  const res = await api.courier.deactivate[':id'].$put(
    { param: { id } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to deactivate courier');
  }
  const data = await res.json();
  return data;
}

export async function updateCourier({
  id,
  courier,
}: {
  id: string;
  courier: EditCourier;
}) {
  const token = await verifyToken();

  const res = await api.courier[':id'].$put(
    { param: { id }, json: courier },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    console.log(res.status, res.statusText);
    throw new Error('Failed to update courier');
  }
  const data = await res.json();
  return data;
}

export async function createNewCourier({
  courier,
}: {
  courier: CreateCourier;
}) {
  const token = await verifyToken();
  try {
    const res = await api.courier.create.$post(
      {
        json: courier,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      throw new Error('Failed to create courier');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create courier');
  }
}
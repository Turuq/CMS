'use server';

import { verifyToken } from '@/utils/helpers/get-token';
import { api } from './api';
import { EditStaff } from '@/utils/validation/staff';
import { createHandoverOfficerSchema } from '@/api/validation/handover-officer';
import { z } from 'zod';
import { createAssignmentOfficerSchema } from '@/api/validation/assignment-officer';

export async function createHandoverOfficer({
  value,
}: {
  value: z.infer<typeof createHandoverOfficerSchema>;
}) {
  try {
    const res = await api['handover-officer'].create.$post({ json: value });
    if (!res.ok) {
      return { error: res.statusText };
    }
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create handover officer' };
  }
}

export async function createAssignmentOfficer({
  value,
}: {
  value: z.infer<typeof createAssignmentOfficerSchema>;
}) {
  try {
    const res = await api['assignment-officer'].create.$post({
      json: value,
    });
    if (!res.ok) {
      return { error: res.statusText };
    }
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create assignment officer' };
  }
}

export async function getHandoverOfficers() {
  const token = await verifyToken();
  const res = await api['handover-officer'].$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get handover officers');
  }
  const data = await res.json();
  return data;
}

export async function getAssignmentOfficers() {
  const token = await verifyToken();
  const res = await api['assignment-officer'].$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Failed to get assignment officers');
  }
  const data = await res.json();
  return data;
}

export async function getStaffById(staffId: string) {
  const token = await verifyToken();
  const res = await api.staff[':id'].$get(
    { param: { id: staffId } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data: EditStaff = await res.json();
  return data;
}

export async function updateStaff(staffId: string, data: EditStaff) {
  const token = await verifyToken();
  const res = await api.staff[':id'].$put(
    { param: { id: staffId }, json: data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const updatedStaff: EditStaff = await res.json();
  return updatedStaff;
}

export async function activateStaff(staffId: string) {
  const token = await verifyToken();
  const res = await api.staff.activate[':id'].$put(
    { param: { id: staffId } },
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
  return data;
}

export async function deactivateStaff(staffId: string) {
  const token = await verifyToken();
  const res = await api.staff.deactivate[':id'].$put(
    { param: { id: staffId } },
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
  return data;
}
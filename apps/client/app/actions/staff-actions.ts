'use server';

import { verifyToken } from '@/utils/helpers/get-token';
import { api } from './api';
import { EditStaff } from '@/utils/validation/staff';

export async function getHandoverOfficers() {
  const token = verifyToken();
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
  const token = verifyToken();
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
  const token = verifyToken();
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
  const token = verifyToken();
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
  const token = verifyToken();
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
  const token = verifyToken();
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
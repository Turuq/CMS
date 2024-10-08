'use server';

import { getToken } from '@/utils/helpers/getToken';
import { api } from './api';
import { redirect } from 'next/navigation';

export async function getHandoverOfficers() {
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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
  const token = getToken();

  if (!token) {
    redirect('/');
  }

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

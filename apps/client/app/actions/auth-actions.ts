'use server';

import { api } from '@/app/actions/api';
import { getPathFromRole } from '@/utils/helpers/get-path-from-role';
import { SignIn } from '@/utils/validation/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInAction(params: SignIn, locale: string) {
  const res = await api.auth['sign-in'].$post({ json: params });
  if (!res.ok) {
    return { error: 'Failed to Sign In' };
  }
  const data = await res.json();
  const { token, role, staffMember } = data;

  // set token cookie
  cookies().set('token', token, {
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60, // 1 hour
  });
  // set role cookie
  cookies().set('role', role, {
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60, // 1 hour
  });
  // set staff member cookie
  cookies().set('user', JSON.stringify(staffMember), {
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60, // 1 hour
  });

  const path = getPathFromRole(role);

  return redirect(`/${locale}/${path}`);
}

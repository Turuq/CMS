import { cookies } from 'next/headers';

export function getToken() {
  return cookies().get('token')?.value;
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function verifyToken() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/');
  }
  return token;
}


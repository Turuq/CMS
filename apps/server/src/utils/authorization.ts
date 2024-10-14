import type { Context } from 'hono';
import { type StaffRole } from '../validation/staff-member';

export function authorizeUser({
  level,
  c,
}: {
  level: StaffRole[];
  c: Context;
}) {
  const { role } = c.var.user;
  if (!level.includes(role)) {
    c.status(403);
    throw new Error('Unauthorized');
  }
}

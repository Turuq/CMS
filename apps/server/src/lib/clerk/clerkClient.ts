import { createClerkClient } from '@clerk/backend';
import { createMiddleware } from 'hono/factory';
import type { AuthenticatedStaffMember } from '../../validation/staff-member';
import { getAuth } from '@hono/clerk-auth';
import { staffMemberModel } from '../../models/staff';

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

type Env = {
  Variables: {
    user: AuthenticatedStaffMember;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return c.json(
        {
          error: 'Unauthorized',
        },
        401
      );
    }

    const data = await clerkClient.users.getUser(token);

    if (!data) {
      return c.json(
        {
          error: 'Unauthorized',
        },
        401
      );
    }

    const { primaryEmailAddress } = data;

    const staffMember = await staffMemberModel
      .findOne({ email: primaryEmailAddress?.emailAddress })
      .select('role email username name active _id');
    c.set('user', staffMember as AuthenticatedStaffMember);
    await next();
  } catch (error: any) {
    console.error(error);
    return c.json(
      {
        message: `Failed to authenticate user: ${error.message}`,
      },
      500
    );
  }
});

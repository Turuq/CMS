import { createClient, type User } from '@supabase/supabase-js';
import { createMiddleware } from 'hono/factory';
import { staffMemberModel } from '../../models/staff';
import type { AuthenticatedStaffMember } from '../../validation/staff-member';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

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
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error(error);
      return c.json(
        {
          error: 'Unauthorized',
        },
        401
      );
    }
    const { email } = data.user;
    const staffMember = await staffMemberModel
      .findOne({ email })
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

export default supabase;

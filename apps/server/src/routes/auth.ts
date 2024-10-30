import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { clerkClient } from '../lib/clerk/clerkClient';
import supabase from '../lib/supabase/supabaseClient';
import { staffMemberModel } from '../models/staff';
import { validateClerkId } from '../utils/validation';
import { authSignInSchema, authSignUpSchema } from '../validation/auth';
import type { AuthenticatedStaffMember } from '../validation/staff-member';

const authRouter = new Hono()
  .post('/sign-up', zValidator('json', authSignUpSchema), async (c) => {
    // Validate request body
    const body = c.req.valid('json');
    // Extract email, username, and password from request
    const { email, username, password } = body;
    try {
      // Check if user already exists
      const existingStaff = await staffMemberModel
        .findOne({ email, username })
        .select('_id');

      if (existingStaff) {
        return c.json(
          {
            message: 'User already exists',
          },
          409
        );
      }

      // Create a user in the database
      const staffMember = await staffMemberModel.create(body);

      if (!staffMember) {
        return c.json(
          {
            message: 'Failed to create user',
          },
          400
        );
      }

      const data = await clerkClient.users.createUser({
        firstName: staffMember.name,
        username,
        emailAddress: [email],
        password,
      });
      // Create a supabase auth user using the email and password & username as an additional property
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       username,
      //     },
      //   },
      // });

      // if (error) {
      //   console.error(error);
      //   return c.json(
      //     {
      //       message: `Failed to create user: ${error.message}`,
      //     },
      //     500
      //   );
      // }

      return c.json(
        {
          message: 'User created',
          data,
        },
        201
      );
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to create user: ${error.message}`,
        },
        500
      );
    }
  })
  .post('/sign-in', zValidator('json', authSignInSchema), async (c) => {
    // Validate request body
    const body = c.req.valid('json');
    // Extract email and password from request body
    const { email, password } = body;
    // Sign in user with supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to sign in using supabase: ${error}`);
      }

      const token = data.session.access_token;

      const staffMember = await staffMemberModel.findOne({ email });

      if (!staffMember) {
        c.status(404);
        throw new Error('Staff Member not found');
      }

      const { role, email: emailAddress, username, name, active } = staffMember;
      return c.json(
        {
          message: 'User signed in',
          token,
          staffMember: { email: emailAddress, username, name, active },
          role,
        },
        200
      );
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  })
  .post('/me', zValidator('json', validateClerkId), async (c) => {
    const { userId } = c.req.valid('json');

    if (!userId) {
      c.status(401);
      throw new Error('Unauthorized');
    }
    const data = await clerkClient.users.getUser(userId);

    if (!data) {
      c.status(401);
      throw new Error('Unauthorized');
    }

    const { primaryEmailAddress } = data;

    const staffMember: AuthenticatedStaffMember | null = await staffMemberModel
      .findOne({ email: primaryEmailAddress?.emailAddress })
      .select('role email username name active _id');
    return c.json(staffMember, 200);
  });

export default authRouter;

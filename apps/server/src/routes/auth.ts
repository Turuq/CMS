import { Hono } from 'hono';

import { authSignInSchema, authSignUpSchema } from '../validation/auth';
import supabase from '../lib/supabase/supabaseClient';
import { staffMemberModel } from '../models/staff';
import { zValidator } from '@hono/zod-validator';

const authRouter = new Hono()
  // .post('/sign-up', zValidator('json', authSignUpSchema), async (c) => {
  //   try {
  //     // Validate request body
  //     const data = c.req.valid('json');
  //     console.log(data);
  //     // Extract email and password from request body
  //     const { email, username, password } = data;
  //     // Create user with Clerk
  //     const user = await clerkClient.users.createUser({
  //       emailAddress: [email],
  //       password,
  //       username,
  //     });

  //     // Check if user was created
  //     if (!user) {
  //       c.status(400);
  //       return c.json({
  //         message: 'Failed to create user',
  //       });
  //     }

  //     // Create session for user
  //     const token = await clerkClient.signInTokens.createSignInToken({
  //       userId: user.id,
  //       expiresInSeconds: 60 * 60, // 1 hour
  //     });

  //     // Respond with user data
  //     c.status(201);
  //     return c.json({
  //       message: 'User created',
  //       token,
  //       user,
  //     });
  //   } catch (error: any) {
  //     c.status(500);
  //     console.error(error);
  //     return c.json({
  //       message: `Failed to create user: ${error.message}`,
  //     });
  //   }
  // })
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

      // Create a supabase auth user using the email and password & username as an additional property
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error(error);
        return c.json(
          {
            message: `Failed to create user: ${error.message}`,
          },
          500
        );
      }

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
        return c.json(
          {
            message: `Failed to sign in: ${error.message}`,
          },
          500
        );
      }

      const token = data.session.access_token;

      const staffMember = await staffMemberModel.findOne({ email });

      if (!staffMember) {
        return c.json(
          {
            message: 'User not found',
          },
          404
        );
      }

      return c.json(
        {
          message: 'User signed in',
          token,
          staffMember,
          role: staffMember.role,
        },
        200
      );
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to sign in: ${error.message}`,
        },
        500
      );
    }
  })
  .get('/me', async (c) => {
    try {
      const token: string | undefined = c.req
        .header('Authorization')
        ?.split(' ')[1];

      if (!token) {
        return c.json(
          {
            message: 'Unauthorized: No Token Provided',
          },
          401
        );
      }

      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        return c.json(
          {
            message: `Session Expired: ${error.message}`,
          },
          401
        );
      }

      if (data.user) {
        return c.json({
          message: 'Session is Valid',
          staffMember: data.user,
        });
      }

      return c.json({ token }, 200);
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to get signed-in user: ${error.message}`,
        },
        500
      );
    }
  });

export default authRouter;

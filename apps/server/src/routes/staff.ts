import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getUser } from '../lib/supabase/supabaseClient';
import { staffMemberModel } from '../models/staff';
import { authorizeUser } from '../utils/authorization';
import { validateObjectId } from '../utils/validation';
import { editStaffMember } from '../validation/staff-member';

const staffRouter = new Hono()
  .get('/:id', zValidator('param', validateObjectId), getUser, async (c) => {
    // check if user is authorized
    authorizeUser({ c, level: ['COURIER_MANAGER'] });
    try {
      // validate param
      const { id } = c.req.valid('param');
      // get staff by id
      const staff = await staffMemberModel.findById(id);
      if (!staff) {
        c.status(404);
        throw new Error('Staff not found');
      }
      return c.json(staff, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get staff: ${error.message}`);
    }
  })
  .put(
    '/activate/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        const { id } = c.req.valid('param');
        const staff = await staffMemberModel.findByIdAndUpdate(id, {
          active: true,
        });
        if (!staff) {
          c.status(404);
          throw new Error('Staff not found');
        }
        return c.json(staff, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to activate staff: ${error.message}`);
      }
    }
  )
  .put(
    '/deactivate/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        const { id } = c.req.valid('param');
        const staff = await staffMemberModel.findByIdAndUpdate(id, {
          active: false,
        });
        if (!staff) {
          c.status(404);
          throw new Error('Staff not found');
        }
        return c.json(staff, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to deactivate staff: ${error.message}`);
      }
    }
  )
  .put(
    '/:id',
    getUser,
    zValidator('param', validateObjectId),
    zValidator('json', editStaffMember),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      try {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        const staff = await staffMemberModel.findByIdAndUpdate(id, data);
        if (!staff) {
          c.status(404);
          throw new Error('Staff not found');
        }
        return c.json(staff, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to update staff: ${error.message}`);
      }
    }
  );

export default staffRouter;

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { validateObjectId } from '../utils/validation';
import {
  createHandoverOfficerSchema,
  updateHandoverOfficerSchema,
} from '../validation/handover-officer';
import { staffMemberModel } from '../models/staff';
import { getUser } from '../lib/clerk/clerkClient';
import { authorizeUser } from '../utils/authorization';
import { clerkClient } from '../lib/clerk/clerkClient';

const handoverOfficerRouter = new Hono()
  .post(
    '/create',
    zValidator('json', createHandoverOfficerSchema),
    async (c) => {
      // Validate request body
      const data = c.req.valid('json');
      // Check if handover officer already exists
      const existingHandoverOfficer = await staffMemberModel.findOne({
        username: data.username,
        role: 'HANDOVER_OFFICER',
      });
      if (existingHandoverOfficer) {
        c.status(409);
        throw new Error('Handover officer already exists');
      }
      // Create new handover officer
      const newHandoverOfficer = new staffMemberModel({
        ...data,
        role: 'HANDOVER_OFFICER',
      });
      try {
        // Save new handover officer
        await newHandoverOfficer.save();

        await clerkClient.users.createUser({
          firstName: data.name,
          username: data.username,
          emailAddress: [data.email],
          password: data.password,
        });

        c.status(201);
        return c.json(newHandoverOfficer);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to create handover officer: ${error.message}`);
      }
    }
  )
  .get('/', getUser, async (c) => {
    authorizeUser({ c, level: ['COURIER_MANAGER'] });
    try {
      const handoverOfficers = await staffMemberModel
        .find({ role: 'HANDOVER_OFFICER' })
        .select('name username phone active nationalId');
      if (!handoverOfficers) {
        c.status(404);
        throw new Error('Handover officers not found');
      }
      c.status(200);
      return c.json(handoverOfficers);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error(`Failed to get handover officers: ${error.message}`);
    }
  })
  .get('/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const handoverOfficer = await staffMemberModel.findById(id);
      if (!handoverOfficer) {
        c.status(404);
        return c.json({
          message: 'Handover officer not found',
        });
      }
      c.status(200);
      return c.json(handoverOfficer);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to get handover officer: ${error.message}`,
      });
    }
  })
  .delete('/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const deletedHandoverOfficer =
        await staffMemberModel.findByIdAndDelete(id);
      if (!deletedHandoverOfficer) {
        c.status(404);
        return c.json({
          message: 'Handover officer not found',
        });
      }
      c.status(204);
      return c.json({ message: 'Handover officer deleted' });
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to delete handover officer: ${error.message}`,
      });
    }
  })
  .put(
    '/:id',
    zValidator('param', validateObjectId),
    zValidator('json', updateHandoverOfficerSchema),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      // Validate request body
      const data = c.req.valid('json');
      try {
        const updatedHandoverOfficer = await staffMemberModel.findByIdAndUpdate(
          id,
          data
        );
        if (!updatedHandoverOfficer) {
          c.status(404);
          return c.json({
            message: 'Handover officer not found',
          });
        }
        c.status(201);
        return c.json(updatedHandoverOfficer);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to update handover officer: ${error.message}`,
        });
      }
    }
  )
  .put('/activate/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const updatedHandoverOfficer = await staffMemberModel.findByIdAndUpdate(
        id,
        {
          active: true,
        }
      );
      if (!updatedHandoverOfficer) {
        c.status(404);
        return c.json({
          message: 'Handover officer not found',
        });
      }
      c.status(201);
      return c.json(updatedHandoverOfficer);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      return c.json({
        message: `Failed to activate handover officer: ${error.message}`,
      });
    }
  });

export default handoverOfficerRouter;

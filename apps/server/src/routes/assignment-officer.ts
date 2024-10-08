import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  createAssignmentOfficerSchema,
  updateAssignmentOfficerSchema,
} from '../validation/assignment-officer';
import { staffMemberModel } from '../models/staff';
import { validateObjectId } from '../utils/validation';
import { getUser } from '../lib/supabase/supabaseClient';

const assignmentOfficerRouter = new Hono()
  .post(
    '/create',
    zValidator('json', createAssignmentOfficerSchema),
    async (c) => {
      // Validate request body
      const data = c.req.valid('json');
      // Check if assignment officer already exists
      const existingAssignmentOfficer = await staffMemberModel.findOne({
        username: data.username,
        role: 'ASSIGNMENT_OFFICER',
      });
      if (existingAssignmentOfficer) {
        return c.json(
          {
            message: 'Assignment Officer already exists',
          },
          409
        );
      }
      // Create new assignment officer
      const newAssignmentOfficer = new staffMemberModel({
        ...data,
        role: 'ASSIGNMENT_OFFICER',
      });
      try {
        // Save new assignment officer
        await newAssignmentOfficer.save();
        return c.json(newAssignmentOfficer, 201);
      } catch (error: any) {
        console.error(error);
        return c.json(
          {
            message: `Failed to create assignment officer: ${error.message}`,
          },
          500
        );
      }
    }
  )
  .get('/', getUser, async (c) => {
    try {
      const { role } = c.var.user;
      if (role !== 'COURIER_MANAGER') {
        c.status(403);
        throw new Error('Unauthorized');
      }
      const assignmentOfficers = await staffMemberModel
        .find({ role: 'ASSIGNMENT_OFFICER' })
        .select('name username phone active nationalId');
      if (!assignmentOfficers) {
        return c.json(
          {
            message: 'No assignment officers found',
          },
          404
        );
      }
      return c.json(assignmentOfficers, 200);
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to get assignment officers: ${error.message}`,
        },
        500
      );
    }
  })
  .get('/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const assignmentOfficer = await staffMemberModel.findById(id);
      if (!assignmentOfficer) {
        return c.json(
          {
            message: 'Assignment officer not found',
          },
          404
        );
      }
      return c.json(assignmentOfficer, 200);
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to get assignment officer: ${error.message}`,
        },
        500
      );
    }
  })
  .delete('/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const deletedAssignmentOfficer =
        await staffMemberModel.findByIdAndDelete(id);
      if (!deletedAssignmentOfficer) {
        return c.json(
          {
            message: 'Assignment officer not found',
          },
          404
        );
      }
      return c.json({ message: 'Assignment officer deleted' }, 204);
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to delete assignment officer: ${error.message}`,
        },
        500
      );
    }
  })
  .put(
    '/:id',
    zValidator('param', validateObjectId),
    zValidator('json', updateAssignmentOfficerSchema),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      // Validate request body
      const data = c.req.valid('json');
      try {
        const updatedAssignmentOfficer =
          await staffMemberModel.findByIdAndUpdate(id, data);
        if (!updatedAssignmentOfficer) {
          return c.json(
            {
              message: 'Assignment officer not found',
            },
            404
          );
        }
        return c.json(updatedAssignmentOfficer, 201);
      } catch (error: any) {
        console.error(error);
        return c.json(
          {
            message: `Failed to update assignment officer: ${error.message}`,
          },
          500
        );
      }
    }
  )
  .put('/activate/:id', zValidator('param', validateObjectId), async (c) => {
    // Validate request params
    const { id } = c.req.valid('param');
    try {
      const updatedAssignmentOfficer = await staffMemberModel.findByIdAndUpdate(
        id,
        {
          active: true,
        }
      );
      if (!updatedAssignmentOfficer) {
        return c.json(
          {
            message: 'Assignment officer not found',
          },
          404
        );
      }
      return c.json(updatedAssignmentOfficer, 201);
    } catch (error: any) {
      console.error(error);
      return c.json(
        {
          message: `Failed to activate assignment officer: ${error.message}`,
        },
        500
      );
    }
  });

export default assignmentOfficerRouter;

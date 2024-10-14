import { Hono } from 'hono';
import { getUser } from '../lib/supabase/supabaseClient';
import { zValidator } from '@hono/zod-validator';
import { validateObjectId } from '../utils/validation';
import { authorizeUser } from '../utils/authorization';
import {
  EndCourierBatchSchema,
  NewCourierBatchSchema,
} from '../validation/courier-batch';
import CourierBatchModel from '../models/courier-batch';
import { getNextSequence } from '../utils/functions';
import { orderModel } from '../models/order';
import { integrationOrderModel } from '../models/integration-order';

const courierBatchRouter = new Hono()
  .post('/', getUser, zValidator('json', NewCourierBatchSchema), async (c) => {
    authorizeUser({ c, level: ['HANDOVER_OFFICER'] });
    try {
      // validate request body
      const data = c.req.valid('json');
      const sequence = await getNextSequence(data.courier);
      // create new courier batch
      const newCourierBatch = new CourierBatchModel({
        ...data,
        BID: sequence,
        courier: data.courier,
      });
      const courierBatch = await newCourierBatch.save();
      if (!courierBatch) {
        c.status(500);
        throw new Error('Failed to create courier batch');
      }
      await orderModel.updateMany(
        { _id: { $in: data.orders } },
        { status: 'outForDelivery', isOutstanding: true }
      );
      await integrationOrderModel.updateMany(
        { _id: { $in: data.integrationOrders } },
        { status: 'outForDelivery', isOutstanding: true }
      );
      return c.json(courierBatch, 201);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .get('/', getUser, async (c) => {
    authorizeUser({ c, level: ['HANDOVER_OFFICER', 'COURIER_MANAGER'] });
    try {
      const batches = await CourierBatchModel.find().populate({
        path: 'courier',
        select: 'name phone zone username',
      });
      if (!batches) {
        c.status(404);
        throw new Error('No Batches Found');
      }
      return c.json(batches, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .get('/:id', getUser, zValidator('param', validateObjectId), async (c) => {
    authorizeUser({ c, level: ['HANDOVER_OFFICER', 'COURIER_MANAGER'] });
    try {
      const { id } = c.req.valid('param');
      const batch = await CourierBatchModel.findById(id).populate({
        path: 'courier',
        select: 'name phone zone username',
      });
      if (!batch) {
        c.status(404);
        throw new Error('Batch not found');
      }
      return c.json(batch, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .put(
    '/end/:id',
    getUser,
    zValidator('param', validateObjectId),
    zValidator('json', EndCourierBatchSchema),
    async (c) => {
      authorizeUser({ c, level: ['HANDOVER_OFFICER'] });
      try {
        const { id } = c.req.valid('param');
        const { endDate } = c.req.valid('json');
        // find courier batch by id and update end date
        const courierBatch = await CourierBatchModel.findByIdAndUpdate(id, {
          endDate,
        });
        if (!courierBatch) {
          c.status(404);
          throw new Error('Courier batch not found');
        }
        return c.json(courierBatch, 201);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  )
  .get(
    '/courier/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({ c, level: ['HANDOVER_OFFICER', 'COURIER_MANAGER'] });
      try {
        const { id } = c.req.valid('param');
        const batch = await CourierBatchModel.findOne({
          courier: id,
          endDate: { $eq: null },
        }).select('_id');
        return c.json({ hasActiveBatch: batch ? true : false }, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  );

export default courierBatchRouter;

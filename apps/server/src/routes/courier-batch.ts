import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { Document } from 'mongoose';
import { getUser } from '../lib/clerk/clerkClient';
import CourierBatchModel from '../models/courier-batch';
import { integrationOrderModel } from '../models/integration-order';
import { orderModel } from '../models/order';
import { authorizeUser } from '../utils/authorization';
import { getNextSequence } from '../utils/functions/helpers';
import { validateJourney, validateObjectId } from '../utils/validation';
import {
  EndCourierBatchSchema,
  NewCourierBatchSchema,
} from '../validation/courier-batch';
import { ObjectId } from 'mongodb';
import { updateCourierMonthlyStatistics } from '../utils/functions/batch-helpers';
import moment from 'moment';

const courierBatchRouter = new Hono()
  .post('/', getUser, zValidator('json', NewCourierBatchSchema), async (c) => {
    authorizeUser({ c, level: ['HANDOVER_OFFICER'] });
    try {
      // validate request body
      const data = c.req.valid('json');
      const { outsourced } = data;
      let courierBatch;
      if (!outsourced) {
        const sequence = await getNextSequence(data.courier);
        // create new courier batch
        const newCourierBatch = new CourierBatchModel({
          ...data,
          BID: sequence,
          courier: data.courier,
        });
        courierBatch = await newCourierBatch.save();
        if (!courierBatch) {
          c.status(500);
          throw new Error('Failed to create courier batch');
        }
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
  .get('/dashboard', async (c) => {
    try {
      const res = await CourierBatchModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'orders',
            foreignField: '_id',
            as: 'orders',
          },
        },
        {
          $lookup: {
            from: 'shopifyorders',
            localField: 'integrationOrders',
            foreignField: '_id',
            as: 'integrationOrders',
          },
        },
        {
          $project: {
            allOrders: { $concatArrays: ['$orders', '$integrationOrders'] },
          },
        },
        {
          $unwind: '$allOrders',
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            outForDelivery: {
              $sum: {
                $cond: [{ $eq: ['$allOrders.status', 'outForDelivery'] }, 1, 0],
              },
            },
            delivered: {
              $sum: {
                $cond: [{ $eq: ['$allOrders.status', 'delivered'] }, 1, 0],
              },
            },
            toBeReshipped: {
              $sum: {
                $cond: [{ $eq: ['$allOrders.toBeReshipped', true] }, 1, 0],
              },
            },
            totalShippingFees: { $sum: '$allOrders.shippingFees' },
            totalToBeReceived: { $sum: '$allOrders.total' },
            // activeBatches: if a batch's endDate doesn't exist or is null, then it's an active batch
            activeBatches: {
              $sum: { $eq: ['$endDate', null] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            outForDelivery: 1,
            delivered: 1,
            totalOrders: 1,
            toBeReshipped: 1,
            totalShippingFees: 1,
            activeBatches: 1,
            totalToBeReceived: 1,
          },
        },
      ]);
      if (!res) {
        c.status(404);
        throw new Error('No Stats Found');
      }
      return c.json(res, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('No Stats Found');
    }
  })
  .get('/dashboard/governorate', async (c) => {
    // authorizeUser({
    //   c,
    //   level: ['HANDOVER_OFFICER', 'COURIER_MANAGER', 'ASSIGNMENT_OFFICER'],
    // });
    try {
      const res = await CourierBatchModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'orders',
            foreignField: '_id',
            as: 'orders',
          },
        },
        {
          $lookup: {
            from: 'shopifyorders',
            localField: 'integrationOrders',
            foreignField: '_id',
            as: 'integrationOrders',
          },
        },
        {
          $project: {
            allOrders: { $concatArrays: ['$orders', '$integrationOrders'] },
          },
        },
        { $unwind: '$allOrders' },
        {
          $group: {
            _id: '$allOrders.customer.governorate',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
          },
        },
      ]);
      if (!res) {
        c.status(404);
        throw new Error('No Stats Found');
      }
      return c.json(res, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .get('/dashboard/orders', async (c) => {
    try {
      const res = await CourierBatchModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'orders',
            foreignField: '_id',
            as: 'orders',
          },
        },
        {
          $lookup: {
            from: 'shopifyorders',
            localField: 'integrationOrders',
            foreignField: '_id',
            as: 'integrationOrders',
          },
        },
        {
          $lookup: {
            from: 'couriers',
            localField: 'courier',
            foreignField: '_id',
            as: 'courier',
          },
        },
        {
          $project: {
            allOrders: { $concatArrays: ['$orders', '$integrationOrders'] },
            courier: { $arrayElemAt: ['$courier', 0] },
          },
        },
        { $unwind: '$allOrders' },
        {
          $group: {
            _id: '$courier.name',
            delivered: {
              $sum: {
                $cond: [{ $eq: ['$allOrders.status', 'delivered'] }, 1, 0],
              },
            },
            outForDelivery: {
              $sum: {
                $cond: [{ $eq: ['$allOrders.status', 'outForDelivery'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            delivered: 1,
            outForDelivery: 1,
            total: { $add: ['$delivered', '$outForDelivery'] },
          },
        },
        {
          $sort: { total: -1 },
        },
      ]);
      if (!res) {
        c.status(404);
        throw new Error('No Stats Found');
      }
      return c.json(res, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .get('/', getUser, async (c) => {
    authorizeUser({ c, level: ['HANDOVER_OFFICER', 'COURIER_MANAGER'] });
    try {
      const batches = await CourierBatchModel.aggregate([
        {
          $lookup: {
            from: 'couriers',
            localField: 'courier',
            foreignField: '_id',
            as: 'courier',
          },
        },
        {
          $unwind: '$courier',
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'orders',
            foreignField: '_id',
            as: 'orders',
          },
        },
        {
          $lookup: {
            from: 'shopifyorders',
            localField: 'integrationOrders',
            foreignField: '_id',
            as: 'integrationOrders',
          },
        },
        {
          $project: {
            courier: {
              name: 1,
              username: 1,
              phone: 1,
              zone: 1,
            },
            BID: 1,
            integrationOrders: {
              status: 1,
            },
            startDate: 1,
            endDate: 1,
            orders: {
              status: 1,
            },
            progress: {
              $add: [
                {
                  $size: {
                    $filter: {
                      input: '$orders',
                      as: 'order',
                      cond: { $eq: ['$$order.status', 'delivered'] },
                    },
                  },
                },
                {
                  $size: {
                    $filter: {
                      input: '$integrationOrders',
                      as: 'intOrder',
                      cond: { $eq: ['$$intOrder.status', 'delivered'] },
                    },
                  },
                },
              ],
            },
            numberOfOrders: {
              $add: [{ $size: '$orders' }, { $size: '$integrationOrders' }],
            },
          },
        },
      ]);
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
      const batch = await CourierBatchModel.findById(id)
        .populate({
          path: 'courier',
          select: 'name phone zone username',
        })
        .populate({
          path: 'orders',
          select:
            'OID client customer products status type total createdAt reshipped shippingFees courierCOD',
          populate: {
            path: 'client',
            select: 'companyName',
          },
        })
        .populate({
          path: 'integrationOrders',
          select:
            'OID client customer products status type total createdAt reshipped shippingFees courierCOD',
          populate: {
            path: 'client',
            select: 'companyName',
          },
        });
      if (!batch) {
        c.status(404);
        throw new Error('Batch not found');
      }
      console.log(batch);
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
      authorizeUser({ c, level: ['HANDOVER_OFFICER', 'COURIER_MANAGER'] });
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

        const statistics = await updateCourierMonthlyStatistics({
          courierId: courierBatch.courier.toString(),
          batchId: id,
          date: moment(endDate).format('MM-YYYY'),
        });

        if (!statistics) {
          c.status(500);
          throw new Error('Failed to update courier statistics');
        }

        return c.json({ batch: courierBatch, statistics }, 201);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  )
  .get(
    '/courier/active/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({
        c,
        level: ['HANDOVER_OFFICER', 'COURIER_MANAGER', 'ASSIGNMENT_OFFICER'],
      });
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
  )
  .get(
    '/courier/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({
        c,
        level: ['HANDOVER_OFFICER', 'COURIER_MANAGER', 'ASSIGNMENT_OFFICER'],
      });
      try {
        const { id } = c.req.valid('param');
        const batches = await CourierBatchModel.aggregate([
          {
            $match: {
              courier: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: 'couriers',
              localField: 'courier',
              foreignField: '_id',
              as: 'courier',
            },
          },
          {
            $unwind: '$courier',
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'orders',
              foreignField: '_id',
              as: 'orders',
            },
          },
          {
            $lookup: {
              from: 'shopifyorders',
              localField: 'integrationOrders',
              foreignField: '_id',
              as: 'integrationOrders',
            },
          },
          {
            $project: {
              courier: {
                name: 1,
                username: 1,
                phone: 1,
                zone: 1,
              },
              BID: 1,
              integrationOrders: {
                status: 1,
              },
              startDate: 1,
              endDate: 1,
              orders: {
                status: 1,
              },
              progress: {
                $add: [
                  {
                    $size: {
                      $filter: {
                        input: '$orders',
                        as: 'order',
                        cond: { $eq: ['$$order.status', 'delivered'] },
                      },
                    },
                  },
                  {
                    $size: {
                      $filter: {
                        input: '$integrationOrders',
                        as: 'intOrder',
                        cond: { $eq: ['$$intOrder.status', 'delivered'] },
                      },
                    },
                  },
                ],
              },
              numberOfOrders: {
                $add: [{ $size: '$orders' }, { $size: '$integrationOrders' }],
              },
            },
          },
        ]);

        if (!batches) {
          c.status(404);
          throw new Error('No Batches Found');
        }
        console.log(batches);
        return c.json(batches, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  )
  .get(
    '/outstanding/:id',
    getUser,
    zValidator('param', validateObjectId),
    async (c) => {
      authorizeUser({
        c,
        level: ['HANDOVER_OFFICER', 'COURIER_MANAGER', 'ASSIGNMENT_OFFICER'],
      });
      try {
        const { id } = c.req.valid('param');
        const batch = (await CourierBatchModel.findById(id)
          .populate({
            path: 'orders',
            select: 'isOutstanding',
          })
          .populate({
            path: 'integrationOrders',
            select: 'isOutstanding',
          })
          .select('orders integrationOrders')) as Document & {
          orders: { isOutstanding: boolean }[];
          integrationOrders: { isOutstanding: boolean }[];
        };

        if (!batch) {
          c.status(404);
          throw new Error('Batch not found');
        }

        // check if any order is outstanding
        const outstandingOrders = batch.orders.some(
          (order) => order.isOutstanding
        );
        const outstandingIntegrationOrders = batch.integrationOrders.some(
          (order) => order.isOutstanding
        );

        const hasOutstanding =
          outstandingOrders || outstandingIntegrationOrders;

        return c.json({ hasOutstanding }, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  )
  .get('/current/:id', zValidator('param', validateObjectId), async (c) => {
    try {
      const { id } = c.req.valid('param');
      const batch = await CourierBatchModel.aggregate([
        {
          $match: {
            courier: new ObjectId(id),
            $or: [{ endDate: null }, { endDate: { $exists: false } }],
          },
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'orders',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'clients',
                  localField: 'client',
                  foreignField: '_id',
                  as: 'client',
                },
              },
              {
                $unwind: '$client',
              },
            ],
            as: 'orders',
          },
        },
        {
          $lookup: {
            from: 'shopifyorders',
            localField: 'integrationOrders',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'clients',
                  localField: 'client',
                  foreignField: '_id',
                  as: 'client',
                },
              },
              {
                $unwind: '$client',
              },
            ],
            as: 'integrationOrders',
          },
        },
        {
          $addFields: {
            combinedOrders: {
              $concatArrays: ['$orders', '$integrationOrders'],
            },
          },
        },
        { $project: { orders: 0, integrationOrders: 0 } },
        // { $unwind: '$combinedOrders' },
        // {
        //   $lookup: {
        //     from: 'clients',
        //     localField: 'combinedOrders.client',
        //     foreignField: '_id',
        //     as: 'combinedOrders.client',
        //   },
        // },
        // { $unwind: '$combinedOrders.client' },
        // {
        //   $project: {
        //     _id: 1,
        //     courier: 1,
        //     startDate: 1,
        //     endDate: 1,
        //     BID: 1,
        //     combinedOrders: 1,
        //   },
        // },
      ]);

      if (!batch) {
        c.status(404);
        throw new Error('Batch not found');
      }
      return c.json({ batch: batch[0] }, 200);
    } catch (error: any) {
      console.error(error);
      c.status(500);
      throw new Error('Internal Server Error: ', error.message);
    }
  })
  .get(
    '/statistics/:type/:id',
    zValidator('param', validateJourney),
    async (c) => {
      try {
        const { id, type } = c.req.valid('param');
        let condition = {};
        switch (type) {
          case 'current':
            condition = {
              $or: [{ endDate: null }, { endDate: { $exists: false } }],
            };
            break;
          case 'previous':
            {
              const currentMonth = moment().format('YYYY-MM');
              const previousMonth = moment()
                .subtract(1, 'months')
                .format('YYYY-MM');
              condition = {
                endDate: {
                  $gte: new Date(`${previousMonth}-01`),
                  $lt: new Date(`${currentMonth}-01`),
                },
              };
            }
            break;
          default:
            break;
        }
        const batch = await CourierBatchModel.aggregate([
          {
            $match: {
              courier: new ObjectId(id),
              ...condition,
            },
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'orders',
              foreignField: '_id',
              as: 'orders',
            },
          },
          {
            $lookup: {
              from: 'shopifyorders',
              localField: 'integrationOrders',
              foreignField: '_id',
              as: 'integrationOrders',
            },
          },
          {
            $addFields: {
              combinedOrders: {
                $concatArrays: ['$orders', '$integrationOrders'],
              },
            },
          },
          { $project: { orders: 0, integrationOrders: 0 } },
          { $unwind: '$combinedOrders' },
          {
            $group: {
              _id: '$combinedOrders.status',
              count: { $sum: 1 },
              toBeReshippedCount: {
                $sum: {
                  $cond: [
                    { $eq: ['$combinedOrders.toBeReshipped', true] },
                    1,
                    0,
                  ],
                },
              },
              gotGhostedCount: {
                $sum: {
                  $cond: [{ $eq: ['$combinedOrders.gotGhosted', true] }, 1, 0],
                },
              },
              totalShippingFees: { $sum: '$combinedOrders.shippingFees' },
              totalToBeReceived: { $sum: '$combinedOrders.total' },
              totalDelivered: {
                $sum: {
                  $cond: [
                    { $eq: ['$combinedOrders.status', 'delivered'] },
                    '$combinedOrders.total',
                    0,
                  ],
                },
              },
              totalCollected: {
                $sum: '$combinedOrders.courierCOD',
              },
            },
          },
          {
            $group: {
              _id: null,
              statusCounts: { $push: { k: '$_id', v: '$count' } },
              totalToBeReshipped: { $sum: '$toBeReshippedCount' },
              totalGotGhosted: { $sum: '$gotGhostedCount' },
              totalShippingFees: { $sum: '$totalShippingFees' },
              totalToBeReceived: { $sum: '$totalToBeReceived' },
              totalDelivered: { $sum: '$totalDelivered' },
              totalCollected: { $sum: '$totalCollected' },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                statusCounts: { $arrayToObject: '$statusCounts' },
                totalToBeReshipped: '$totalToBeReshipped',
                totalGotGhosted: '$totalGotGhosted',
                totalShippingFees: '$totalShippingFees',
                totalToBeReceived: '$totalToBeReceived',
                totalDelivered: '$totalDelivered',
                totalCollected: '$totalCollected',
              },
            },
          },
        ]);
        if (!batch) {
          c.status(404);
          throw new Error('Batch not found');
        }
        return c.json({ daily: batch[0] }, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error('Internal Server Error: ', error.message);
      }
    }
  );

export default courierBatchRouter;

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getUser } from '../lib/clerk/clerkClient';
import { ClientModel } from '../models/client';
import { CourierModel } from '../models/courier';
import { integrationOrderModel } from '../models/integration-order';
import { orderModel } from '../models/order';
import {
  validateCourierOrdersPagination,
  validateFilters,
  validateObjectId,
  validateObjectIdArray,
  validatePagination,
} from '../utils/validation';
import { authorizeUser } from '../utils/authorization';
import { orderUpdateSchema } from '../validation/orders';
import FinanceModel from '../models/finance';

const orderRouter = new Hono()
  // GET ALL ORDERS, PAGINATED, & FILTERED
  .post(
    '/turuq/:page/:pageSize',
    getUser,
    zValidator('param', validatePagination),
    zValidator('json', validateFilters),
    async (c) => {
      authorizeUser({ c, level: ['COURIER_MANAGER'] });
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      const conditions = c.req.valid('json');
      try {
        const orders = await orderModel
          .find(conditions)
          .populate({
            path: 'client',
            model: ClientModel,
            select: '_id companyName',
          })
          .populate({
            path: 'courier',
            select: '_id name phone',
          })
          .limit(Number(pageSize))
          .skip((Number(page) - 1) * Number(pageSize))
          .sort({ createdAt: -1 });
        const totalPages =
          (await orderModel.countDocuments(conditions)) / Number(pageSize);
        if (!orders) {
          c.status(404);
          throw new Error('No orders found');
        }

        c.status(200);
        return c.json({ len: orders.length, totalPages, orders });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get orders: ${error.message}`);
      }
    }
  )
  .post(
    '/integration/:page/:pageSize',
    getUser,
    zValidator('param', validatePagination),
    zValidator('json', validateFilters),
    async (c) => {
      const { role } = c.var.user;
      if (role !== 'COURIER_MANAGER') {
        c.status(403);
        throw new Error('Unauthorized');
      }
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      const conditions = c.req.valid('json');
      try {
        const integrationOrders = await integrationOrderModel
          .find(conditions)
          .populate({
            path: 'client',
            model: ClientModel,
            select: '_id companyName',
          })
          .populate({
            path: 'courier',
            select: '_id name phone',
          })
          .limit(Number(pageSize))
          .skip((Number(page) - 1) * Number(pageSize))
          .sort({ createdAt: -1 });
        const totalPages =
          (await integrationOrderModel.countDocuments(conditions)) /
          Number(pageSize);
        if (!integrationOrders) {
          c.status(404);
          throw new Error('No integration orders found');
        }

        c.status(200);
        return c.json({
          len: integrationOrders.length,
          totalPages,
          integrationOrders,
        });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get integration orders: ${error.message}`);
      }
    }
  )
  // FIXME: Merge the following two endpoints into a single endpoint after the restructuring phase
  .get(
    '/turuq/assigned/:id/:page/:pageSize',
    zValidator('param', validateCourierOrdersPagination),
    async (c) => {
      // Validate request params
      const { id, page, pageSize } = c.req.valid('param');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          throw new Error('Courier not found');
        }

        // Find Processing Orders Assigned to Courier
        const orders = await orderModel
          .find({ courier: id, status: 'processing' })
          .skip((Number(page) - 1) * Number(pageSize))
          .limit(Number(pageSize))
          .populate({
            path: 'client',
            select: 'companyName name',
          });

        const totalPages = await orderModel.countDocuments({
          courier: id,
          status: 'processing',
        });

        if (!orders) {
          c.status(404);
          throw new Error('No orders found');
        }

        c.status(200);
        return c.json({
          orders,
          totalPages: Math.ceil(totalPages / Number(pageSize)),
        });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get orders: ${error.message}`);
      }
    }
  )
  .get(
    '/integration/assigned/:id/:page/:pageSize',
    zValidator('param', validateCourierOrdersPagination),
    async (c) => {
      // Validate request params
      const { id, page, pageSize } = c.req.valid('param');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          throw new Error('Courier not found');
        }

        // Find Processing Integration Orders Assigned to Courier
        const integrationOrders = await integrationOrderModel
          .find({ courier: id, status: 'processing' })
          .skip((Number(page) - 1) * Number(pageSize))
          .limit(Number(pageSize))
          .populate({
            path: 'client',
            select: 'companyName name',
          });

        const totalPages = await integrationOrderModel.countDocuments({
          courier: id,
          status: 'processing',
        });

        if (!integrationOrders) {
          c.status(404);
          throw new Error('No orders found');
        }

        c.status(200);
        return c.json({
          integrationOrders,
          totalPages: Math.ceil(totalPages / Number(pageSize)),
        });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get orders: ${error.message}`);
      }
    }
  )
  // FIXME: Merge the following two endpoints into a single endpoint after the restructuring phase
  // Processing & Unassigned Orders
  .get(
    '/turuq/processing/unassigned/:page/:pageSize',
    zValidator('param', validatePagination),
    async (c) => {
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      try {
        // Find Processing Orders
        // Paginate Orders using page and pageSize
        const orders = await orderModel
          .find({
            $and: [
              { status: 'processing' },
              { $or: [{ courier: { $exists: false } }, { courier: null }] },
            ],
          })
          .populate({
            path: 'client',
            select: 'companyName',
          })
          .select(
            'OID client customer products status type subtotal shippingFees total createdAt'
          )
          .skip((+page - 1) * +pageSize)
          .limit(+pageSize)
          .sort({ createdAt: -1 });

        const totalPages = await orderModel.countDocuments({
          $and: [
            { status: 'processing' },
            { $or: [{ courier: { $exists: false } }, { courier: null }] },
          ],
        });

        if (!orders) {
          c.status(404);
          throw new Error('No orders found');
        }

        // TODO: create order type
        const response: { len: number; orders: any[]; totalPages: number } = {
          len: orders.length,
          orders,
          totalPages: Math.ceil(totalPages / +pageSize),
        };

        c.status(200);
        return c.json(response);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get orders: ${error.message}`);
      }
    }
  )
  .get(
    '/integration/processing/unassigned/:page/:pageSize',
    zValidator('param', validatePagination),
    async (c) => {
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      try {
        // Find Processing Orders
        // Paginate Orders using page and pageSize
        const integrationOrders = await integrationOrderModel
          .find({
            $and: [
              { status: 'processing' },
              { $or: [{ courier: { $exists: false } }, { courier: null }] },
            ],
          })
          .populate({
            path: 'client',
            select: 'companyName',
          })
          .select(
            'OID client customer products status type subtotal shippingFees total createdAt'
          )
          .skip((+page - 1) * +pageSize)
          .limit(+pageSize)
          .sort({ createdAt: -1 });

        const totalPages = await integrationOrderModel.countDocuments({
          $and: [
            { status: 'processing' },
            { $or: [{ courier: { $exists: false } }, { courier: null }] },
          ],
        });

        if (!integrationOrders) {
          c.status(404);
          throw new Error('No integration orders found');
        }

        const response: {
          len: number;
          integrationOrders: any[];
          totalPages: number;
        } = {
          len: integrationOrders.length,
          integrationOrders,
          totalPages: Math.ceil(totalPages / +pageSize),
        };

        c.status(200);
        return c.json(response);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get integration orders: ${error.message}`);
      }
    }
  )
  // FIXME: Merge the following two endpoints into a single endpoint after the restructuring phase
  // Processing & Assigned Orders
  .get(
    '/turuq/processing/assigned/:page/:pageSize',
    zValidator('param', validatePagination),
    async (c) => {
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      try {
        // Find Processing Orders
        // Paginate Orders using page and pageSize
        const orders = await orderModel
          .find({
            $and: [
              { status: 'processing' },
              {
                $and: [
                  { courier: { $exists: true } },
                  { courier: { $ne: null } },
                ],
              },
            ],
          })
          .select(
            'OID client customer products status type subtotal shippingFees total createdAt courier'
          )
          .skip((+page - 1) * +pageSize)
          .limit(+pageSize)
          .sort({ createdAt: -1 });

        if (!orders) {
          c.status(404);
          return c.json({
            message: 'No orders found',
          });
        }

        c.status(200);
        return c.json({ len: orders.length, orders });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to get orders: ${error.message}`,
        });
      }
    }
  )
  .get(
    '/integration/processing/assigned/:page/:pageSize',
    zValidator('param', validatePagination),
    async (c) => {
      // Validate request params
      const { page, pageSize } = c.req.valid('param');
      try {
        // Find Processing Orders
        // Paginate Orders using page and pageSize
        const integrationOrders = await integrationOrderModel
          .find({
            $and: [
              { status: 'processing' },
              {
                $and: [
                  { courier: { $exists: true } },
                  { courier: { $ne: null } },
                ],
              },
            ],
          })
          .select(
            'OID client customer products status type subtotal shippingFees total createdAt courier'
          )
          .skip((+page - 1) * +pageSize)
          .limit(+pageSize)
          .sort({ createdAt: -1 });

        if (!integrationOrders) {
          c.status(404);
          return c.json({
            message: 'No integration orders found',
          });
        }

        c.status(200);
        return c.json({ len: integrationOrders.length, integrationOrders });
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to get integration orders: ${error.message}`,
        });
      }
    }
  )
  // FIXME: Merge the following two endpoints into a single endpoint after the restructuring phase
  .put(
    '/turuq/assign/:id',
    zValidator('param', validateObjectId),
    zValidator('json', validateObjectIdArray),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      // Validate request body
      const data = c.req.valid('json');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }
        //   Assign Courier to Orders
        const updateResult = await orderModel.updateMany(
          { _id: { $in: data.ids } },
          { courier: id, status: 'processing' }
        );
        if (!updateResult) {
          c.status(400);
          return c.json({
            message: 'Failed to assign courier to orders',
          });
        }
        if (
          updateResult.acknowledged &&
          updateResult.modifiedCount === data.ids.length
        ) {
          c.status(201);
          return c.json({
            message: `Assigned Courier to ${updateResult.modifiedCount} Orders Successfully`,
          });
        }
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to assign courier: ${error.message}`,
        });
      }
    }
  )
  .put(
    '/integration/assign/:id',
    zValidator('param', validateObjectId),
    zValidator('json', validateObjectIdArray),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      // Validate request body
      const data = c.req.valid('json');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          return c.json({
            message: 'Courier not found',
          });
        }
        //   Assign Courier to Orders
        const updateResult = await integrationOrderModel.updateMany(
          { _id: { $in: data.ids } },
          { courier: id, status: 'processing' }
        );
        if (!updateResult) {
          c.status(400);
          return c.json({
            message: 'Failed to assign courier to orders',
          });
        }
        if (
          updateResult.acknowledged &&
          updateResult.modifiedCount === data.ids.length
        ) {
          c.status(201);
          return c.json({
            message: `Assigned Courier to ${updateResult.modifiedCount} Orders Successfully`,
          });
        }
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to assign courier: ${error.message}`,
        });
      }
    }
  )
  // FIXME: Merge the following two endpoints into a single endpoint after the restructuring phase
  .put(
    '/turuq/handover/:id',
    zValidator('param', validateObjectId),
    zValidator('json', validateObjectIdArray),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');
      try {
        // Check if order courier is assigned to all provided orders
        const orders = await orderModel.find({
          courier: id,
          _id: { $in: data.ids },
        });
        if (orders.length !== data.ids.length) {
          c.status(412);
          return c.json({
            message: 'Courier is not assigned to all provided orders',
          });
        }
        // Handover Orders
        const updateResult = await orderModel.updateMany(
          { _id: { $in: data.ids } },
          { status: 'outForDelivery', toBeReshipped: false }
        );
        if (!updateResult) {
          c.status(400);
          return c.json({
            message: 'Failed to handover orders',
          });
        }
        if (
          updateResult.acknowledged &&
          updateResult.modifiedCount === data.ids.length
        ) {
          c.status(201);
          return c.json({
            message: `Handed over ${updateResult.modifiedCount} Orders Successfully`,
          });
        }
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: 'Failed to handover orders: ${error.message}',
        });
      }
    }
  )
  .put(
    '/integration/handover/:id',
    zValidator('param', validateObjectId),
    zValidator('json', validateObjectIdArray),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');
      try {
        // Check if order courier is assigned to all provided orders
        const orders = await integrationOrderModel.find({
          courier: id,
          _id: { $in: data.ids },
        });
        if (orders.length !== data.ids.length) {
          c.status(412);
          return c.json({
            message: 'Courier is not assigned to all provided orders',
          });
        }
        // Handover Orders
        const updateResult = await integrationOrderModel.updateMany(
          { _id: { $in: data.ids } },
          { status: 'outForDelivery', toBeReshipped: false }
        );
        if (!updateResult) {
          c.status(400);
          return c.json({
            message: 'Failed to handover orders',
          });
        }
        if (
          updateResult.acknowledged &&
          updateResult.modifiedCount === data.ids.length
        ) {
          c.status(201);
          return c.json({
            message: `Handed over ${updateResult.modifiedCount} Orders Successfully`,
          });
        }
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: 'Failed to handover orders: ${error.message}',
        });
      }
    }
  )
  .patch(
    '/turuq/update/:id',
    zValidator('param', validateObjectId),
    zValidator('json', orderUpdateSchema),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        const updater = c.req.valid('json');
        const order = await orderModel
          .findById(id)
          .select('_id statusHistory status client subtotal shippingFees');
        if (!order) {
          c.status(404);
          throw new Error('Order not found');
        }

        // update status history
        let statusHistory = order.statusHistory;
        if (updater.status && statusHistory) {
          statusHistory[updater.status as keyof typeof statusHistory] =
            new Date();
        }

        // update order
        const result = await orderModel.updateOne(
          { _id: id },
          { ...updater, statusHistory, isOutstanding: false }
        );
        if (result.modifiedCount === 0) {
          c.status(400);
          return c.json({ message: 'Failed to update order' }, 400);
        } else {
          if (updater.status !== order.status) {
            await ClientModel.findByIdAndUpdate(order.client, {
              $inc: {
                [`orderStatistics.turuqOrders.${updater.status}`]: 1,
                [`orderStatistics.turuqOrders.${order.status}`]: -1,
              },
            });
          }

          if (updater.status === 'delivered') {
            await FinanceModel.findOneAndUpdate(
              { client: order.client },
              {
                $inc: {
                  balance: order.subtotal,
                  shipping: order.shippingFees,
                },
              }
            );
          }
        }

        return c.json({ message: 'Order updated successfully' }, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to update order: ${error.message}`,
        });
      }
    }
  )
  .patch(
    '/integration/update/:id',
    zValidator('param', validateObjectId),
    zValidator('json', orderUpdateSchema),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        const updater = c.req.valid('json');
        const order = await integrationOrderModel
          .findById(id)
          .select(
            '_id statusHistory status client subtotal shippingFees provider'
          );
        if (!order) {
          c.status(404);
          throw new Error('Order not found');
        }

        // update status history
        let statusHistory = order.statusHistory;
        if (updater.status && statusHistory) {
          statusHistory[updater.status as keyof typeof statusHistory] =
            new Date();
        }

        // update order
        const result = await integrationOrderModel.updateOne(
          { _id: id },
          { ...updater, statusHistory, isOutstanding: false }
        );
        if (result.modifiedCount === 0) {
          c.status(400);
          throw new Error('Failed to update order');
        } else {
          if (updater.status !== order.status) {
            const clientResponse = await ClientModel.findByIdAndUpdate(
              order.client,
              {
                $inc: {
                  [`orderStatistics.integrationOrders.${order.provider?.toLowerCase()}.${updater.status}`]: 1,
                  [`orderStatistics.integrationOrders.${order.provider?.toLowerCase()}.${order.status}`]:
                    -1,
                },
              }
            );
            if (!clientResponse) {
              console.log('Failed to update client statistics');
              c.status(400);
              throw new Error('Failed to update client statistics');
            }
          }

          if (updater.status === 'delivered') {
            const financeResponse = await FinanceModel.findOneAndUpdate(
              { client: order.client },
              {
                $inc: {
                  balance: order.subtotal,
                  shipping: order.shippingFees,
                },
              }
            );

            if (!financeResponse) {
              console.log('Failed to update finance');
              c.status(400);
              throw new Error('Failed to update finance');
            }
          }
        }

        return c.json({ message: 'Order updated successfully' }, 200);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        return c.json({
          message: `Failed to update order: ${error.message}`,
        });
      }
    }
  );

export default orderRouter;

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { CourierModel } from '../models/courier';
import {
  validateFilters,
  validateObjectId,
  validateObjectIdArray,
  validatePagination,
} from '../utils/validation';
import { orderModel } from '../models/order';
import { integrationOrderModel } from '../models/integration-order';
import prisma from '../../prisma/prismaClient';
import { ClientModel } from '../models/client';
import type { orders } from '@prisma/client';
import { getUser } from '../lib/supabase/supabaseClient';

const orderRouter = new Hono()
  // GET ALL ORDERS, PAGINATED, & FILTERED
  .post(
    '/turuq/:page/:pageSize',
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
    '/turuq/assigned/:id',
    zValidator('param', validateObjectId),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          throw new Error('Courier not found');
        }

        // Find Processing Orders Assigned to Courier
        const orders = await prisma.orders.findMany({
          where: {
            courier: id,
            status: 'processing',
          },
          include: {
            client: {
              select: {
                companyName: true,
                name: true,
              },
            },
          },
        });

        if (!orders) {
          c.status(404);
          throw new Error('No orders found');
        }

        c.status(200);
        return c.json(orders);
      } catch (error: any) {
        console.error(error);
        c.status(500);
        throw new Error(`Failed to get orders: ${error.message}`);
      }
    }
  )
  .get(
    '/integration/assigned/:id',
    zValidator('param', validateObjectId),
    async (c) => {
      // Validate request params
      const { id } = c.req.valid('param');
      try {
        const courier = await CourierModel.findById(id).select('_id');
        if (!courier) {
          c.status(404);
          throw new Error('Courier not found');
        }

        // Find Processing Integration Orders Assigned to Courier
        const integrationOrders = await prisma.shopifyorders.findMany({
          where: {
            courier: id,
            status: 'processing',
          },
          include: {
            client: {
              select: {
                companyName: true,
                name: true,
              },
            },
          },
        });

        if (!integrationOrders) {
          c.status(404);
          throw new Error('No orders found');
        }

        c.status(200);
        return c.json(integrationOrders);
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

        if (!orders) {
          c.status(404);
          throw new Error('No orders found');
        }

        // TODO: create order type
        const response: { len: number; orders: any[] } = {
          len: orders.length,
          orders,
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

        if (!integrationOrders) {
          c.status(404);
          throw new Error('No integration orders found');
        }

        const response: { len: number; integrationOrders: any[] } = {
          len: integrationOrders.length,
          integrationOrders,
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
          { status: 'outForDelivery' }
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
          { status: 'outForDelivery' }
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
  );

export default orderRouter;

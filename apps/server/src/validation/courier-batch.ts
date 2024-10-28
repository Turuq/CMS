import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { courierSchema } from './courier';
import { detailedOrderSchema } from './orders';

export const NewCourierBatchSchema = z.object({
  courier: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
  startDate: z.string().date(),
  // .min(new Date(), { message: 'Start date must be in the future' }),
  orders: z.array(
    z
      .string()
      .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' })
  ),
  integrationOrders: z.array(
    z
      .string()
      .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' })
  ),
  outsourced: z.boolean(),
});

export const CourierBatchSchema = NewCourierBatchSchema.extend({
  BID: z.number(),
  _id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
  endDate: z.string().date(),
  courier: courierSchema,
  orders: detailedOrderSchema.array(),
  integrationOrders: detailedOrderSchema.array(),
});

export const CourierBatchSummarySchema = CourierBatchSchema.extend({
  progress: z.number(),
  numberOfOrders: z.number(),
});

export const EndCourierBatchSchema = z.object({
  endDate: z.string().date(),
});

export type CourierBatch = z.infer<typeof CourierBatchSchema>;
export type CourierBatchSummary = z.infer<typeof CourierBatchSummarySchema>;

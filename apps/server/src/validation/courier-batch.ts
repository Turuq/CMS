import { z } from 'zod';
import { ObjectId } from 'mongodb';

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
});

export const CourierBatchSchema = NewCourierBatchSchema.extend({
  _id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
  endDate: z
    .date()
    .min(new Date(), { message: 'End date must be in the future' }),
});

export const EndCourierBatchSchema = z.object({
  endDate: z
    .date()
    .min(new Date(), { message: 'End date must be in the future' }),
});

export type CourierBatch = z.infer<typeof CourierBatchSchema>;

import { Schema } from 'mongoose';
import { z } from 'zod';

export const statusHistorySchema = new Schema({
  //key value pair of status and date where status is the key and date is the value

  delivered: {
    type: Date,
  },
  outForDelivery: {
    type: Date,
  },
  pending: {
    type: Date,
  },
  unreachable: {
    type: Date,
  },
  postponed: {
    type: Date,
  },
  cancelled: {
    type: Date,
  },
  returned: {
    type: Date,
  },
  collected: {
    type: Date,
  },
  outOfStock: {
    type: Date,
  },
  processing: {
    type: Date,
  },
  invalidAddress: {
    type: Date,
  },
});

export const statusHistoryZodSchema = z.object({
  delivered: z.string().optional(),
  outForDelivery: z.string().optional(),
  pending: z.string().optional(),
  unreachable: z.string().optional(),
  postponed: z.string().optional(),
  cancelled: z.string().optional(),
  returned: z.string().optional(),
  collected: z.string().optional(),
  outOfStock: z.string().optional(),
  processing: z.string().optional(),
  invalidAddress: z.string().optional(),
});
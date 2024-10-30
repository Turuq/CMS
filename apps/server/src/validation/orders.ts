import { z } from 'zod';
import { statusHistoryZodSchema } from '../models/shared/status-history';

const customerSchema = z.object({
  _id: z.string(),
  address: z.string(),
  governorate: z.string(),
  name: z.string(),
  phone: z.string(),
});

const clientSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  companyName: z.string(),
});

const imageSchema = z.object({
  instapayReceipt: z.string(),
  proofOfContact: z.string(),
  proofOfGhosting: z.string(),
  proofOfPostponement: z.string(),
  proofOfUnreachable: z.string(),
});

const productSchema = z.object({
  UID: z.string(),
  _id: z.string(),
  client: clientSchema,
  price: z.number(),
  quantity: z.number(),
  returned: z.boolean().optional(),
  type: z.string().optional(),
});

export const orderSchema = z.object({
  _id: z.string(),
  OID: z.string(),
  cancellationReason: z.string().optional(),
  client: z.string(),
  courier: z.string().optional(),
  courierAssignedAt: z.string().optional(),
  courierCOD: z.number().optional(),
  courierNotes: z.string().optional(),
  createdAt: z.string(),
  customer: customerSchema,
  gotGhosted: z.boolean().optional(),
  hasReturnedItems: z.boolean().optional(),
  isOutstanding: z.boolean().optional(),
  missedOpportunity: z.boolean().optional(),
  notes: z.string().optional(),
  orderImages: imageSchema,
  paidShippingOnly: z.boolean().optional(),
  paymentMethod: z.string(),
  postponedDate: z.string().datetime().optional(),
  products: productSchema.array(),
  reshipped: z.boolean().optional(),
  shippingFees: z.number(),
  status: z.string(),
  statusHistory: statusHistoryZodSchema,
  subtotal: z.number(),
  toBeReshipped: z.boolean().optional(),
  total: z.number(),
  type: z.string().optional(),
  updatedAt: z.string(),
});

export const detailedOrderSchema = orderSchema.extend({
  client: clientSchema,
});

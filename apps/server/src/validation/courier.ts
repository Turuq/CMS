import { z } from 'zod';

export const courierSchema = z.object({
  _id: z.string(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  phone: z.string().min(11).max(11),
  salary: z.number().positive().min(0),
  zone: z.string().nullable(),
  reshippedOrders: z.number().positive().min(0),
  commissionPerOrder: z.number().positive().min(0),
  active: z.boolean(),
  nationalIdImage: z.string().url(),
  driverLicenseImage: z.string().url(), // Driver license image
  criminalRecordImage: z.string().url(), // Criminal record image
  outSourced: z.boolean(),
});

export const createCourierSchema = z.object({
  name: z.string(),
  username: z.string(),
  phone: z.string().min(11).max(11),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  nationalIdImage: z.string().url(),
  driverLicenseImage: z.string().url(), // Driver license image
  criminalRecordImage: z.string().url(), // Criminal record image
  outSourced: z.boolean().optional(),
});

export const courierUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  phone: z.string().min(11).max(11).optional(),
  salary: z.number().positive().min(0).optional(),
  zone: z.string().optional(),
  commissionPerOrder: z.number().positive().min(0).optional(),
  nationalIdImage: z.string().url().optional(),
  driverLicenseImage: z.string().url().optional(),
  criminalRecordImage: z.string().url().optional(),
  outSourced: z.boolean().optional(),
});

export const statisticsSchema = z.object({
  cancelled: z.number().positive(),
  courierCollected: z.number().positive(),
  delivered: z.number().positive(),
  gotGhosted: z.number().positive(),
  instapay: z.number().positive(),
  maxPossibleDelivered: z.number().positive(),
  outForDelivery: z.number().positive(),
  paidShippingOnly: z.number().positive(),
  postponed: z.number().positive(),
  returned: z.number().positive(),
  toBeReshipped: z.number().positive(),
  totalDelivered: z.number().positive(),
  unreachable: z.number().positive(),
});

export type Courier = z.infer<typeof courierSchema>;
export type CourierCardType = Pick<
  Courier,
  'username' | 'email' | 'name' | 'phone' | 'zone'
> & { id: string };

export type CourierWithStatistics = Courier & {
  statistics: z.infer<typeof statisticsSchema>;
};

import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const courierSchema = z.object({
  _id: z.instanceof(ObjectId),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  phone: z.string().min(11).max(11),
  salary: z.number().positive().min(0),
  zone: z.string(),
  reshippedOrders: z.number().positive().min(0),
  commissionPerOrder: z.number().positive().min(0),
  active: z.boolean(),
  nationalIdImage: z.string().url(),
  driverLicense: z.string().url(), // Driver license image
  criminalRecord: z.string().url(), // Criminal record image
});

export const createCourierSchema = z.object({
  name: z.string(),
  username: z.string(),
  phone: z.string().min(11).max(11),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  nationalIdImage: z.string().url(),
  driverLicense: z.string().url(), // Driver license image
  criminalRecord: z.string().url(), // Criminal record image
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
  driverLicense: z.string().url().optional(),
  criminalRecord: z.string().url().optional(),
});

export type Courier = Omit<z.infer<typeof courierSchema>, 'password'>;

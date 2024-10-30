import { z } from 'zod';
import { ObjectId } from 'mongodb';

export type StaffRole =
  | 'HANDOVER_OFFICER'
  | 'ASSIGNMENT_OFFICER'
  | 'COURIER_MANAGER';

const authenticatedStaffMember = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.enum(['HANDOVER_OFFICER', 'ASSIGNMENT_OFFICER', 'COURIER_MANAGER']),
  active: z.boolean(),
});

export const editStaffMember = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  username: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters long' }),
  phone: z
    .string()
    .min(11, { message: 'Phone has to be exactly 11 digits' })
    .max(11, { message: 'Phone has to be exactly 11 digits' }),
  nationalId: z
    .string()
    .min(14, { message: 'National Id has to be exactly 14 digits' })
    .max(14, { message: 'National Id has to be exactly 14 digits' }),
  role: z.string(),
  nationalIdImage: z.string().url(),
  criminalRecordImage: z.string().url(),
});

export type AuthenticatedStaffMember = z.infer<typeof authenticatedStaffMember>;

import { z } from 'zod';

export type Staff = {
  _id: string;
  name: string;
  phone: string;
  active: boolean;
  nationalId: string;
  zone?: string;
  commissionPerOrder?: number;
};

export const NewStaffSchema = z.object({
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
  role: z.enum(['HANDOVER_OFFICER', 'ASSIGNMENT_OFFICER', 'COURIER_MANAGER']),
  password: z.string(),
  nationalIdImage: z.string().url(),
  criminalRecordImage: z.string().url(),
});

export const EditStaffSchema = z.object({
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
  driverLicenseImage: z.string().url().optional(),
});

export type NewStaff = z.infer<typeof NewStaffSchema>;
export type EditStaff = z.infer<typeof EditStaffSchema>;

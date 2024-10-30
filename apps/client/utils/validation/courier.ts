import { z } from 'zod';

export const EditCourierSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
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
  zone: z.string().optional(),
  nationalIdImage: z.string().url(),
  criminalRecordImage: z.string().url(),
  driverLicenseImage: z.string().url(),
});

export type EditCourier = z.infer<typeof EditCourierSchema>;

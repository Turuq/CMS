import { z } from 'zod';

export const authSignUpSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8),
  role: z.enum(['ASSIGNMENT_OFFICER', 'COURIER_MANAGER', 'HANDOVER_OFFICER']),
  phone: z.string(),
  nationalId: z.string(),
  nationalIdImage: z.string(),
  name: z.string(),
  criminalRecord: z.string(),
  salary: z.number().positive().optional(),
});

export const authSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

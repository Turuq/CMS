import { ObjectId } from 'mongodb';
import { z } from 'zod';

// positive number regex
const positiveNumberRegex = /^[1-9]\d*$/;

export const validateObjectId = z.object({
  id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
});

export const validateJourney = z.object({
  id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
  type: z.enum(['current', 'previous', 'all']),
});

export const validateClerkId = z.object({
  userId: z.string().nullable(),
});

export const validateObjectIdArray = z.object({
  ids: z.array(
    z
      .string()
      .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' })
  ),
});

export const validatePagination = z.object({
  page: z.string().regex(positiveNumberRegex, {
    message: 'Page has to be a positive integer',
  }),
  pageSize: z.string().regex(positiveNumberRegex, {
    message: 'PageSize has to be a positive integer',
  }),
});

export const validateCourierOrdersPagination = validatePagination.extend({
  id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' }),
});

export const validateFilters = z.object({
  courier: z.string().optional(),
  status: z.string().optional(),
  OID: z.string().optional(),
});

export type FilterObject = z.infer<typeof validateFilters>;

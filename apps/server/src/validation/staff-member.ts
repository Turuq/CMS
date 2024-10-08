import { z } from 'zod';
import { ObjectId } from 'mongodb';

const authenticatedStaffMember = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.enum(['HANDOVER_OFFICER', 'ASSIGNMENT_OFFICER', 'COURIER_MANAGER']),
  active: z.boolean(),
});

export type AuthenticatedStaffMember = z.infer<typeof authenticatedStaffMember>;

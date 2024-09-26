import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const assignmentOfficerSchema = z.object({
  _id: z.instanceof(ObjectId),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  phone: z.string().min(11).max(11),
  salary: z.number().positive().min(0),
  active: z.boolean(),
  nationalIdImage: z.string().url(),
  criminalRecord: z.string().url(), // Criminal record image
});

export const createAssignmentOfficerSchema = z.object({
  name: z.string(),
  username: z.string(),
  phone: z.string().min(11).max(11),
  email: z.string().email().optional(),
  nationalId: z.string().min(14).max(14),
  nationalIdImage: z.string().url(),
  criminalRecord: z.string().url(), // Criminal record image
});

export const updateAssignmentOfficerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  phone: z.string().min(11).max(11).optional(),
  salary: z.number().positive().min(0).optional(),
  nationalIdImage: z.string().url().optional(),
  criminalRecord: z.string().url().optional(),
});

export type AssignmentOfficer = Omit<
  z.infer<typeof assignmentOfficerSchema>,
  'password'
>;

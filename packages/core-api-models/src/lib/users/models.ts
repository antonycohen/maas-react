import * as z from 'zod';
import { readImageSchema } from '../image';

export const userSchema = z.object({
  id: z.string(),
  email: z.email().nullable(),
  phoneNumber: z.string().nullable(),
  firstName: z.string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters.")
    .nullable(),
  lastName: z.string().nullable(),
  profileImage: z.object(readImageSchema).nullable(),
  coverImage: z.object(readImageSchema).nullable(),
  roles: z.array(z.string()).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  locale: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

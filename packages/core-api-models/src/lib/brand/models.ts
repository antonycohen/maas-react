import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';

export const readBrandRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export const brandRefSchema = z.object({
  id: z.string(),
});

export type ReadBrandRef = z.infer<typeof readBrandRefSchema>;

// Full brand schema for read operations
export const brandSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  description: z.string().max(5000).nullable(),
  logo: z.object(readImageSchema).nullable(),
  isActive: z.boolean().nullable(),
  issueCount: z.number().nullable(),
  issueConfiguration: z.object({
    defaultFolders: z.record(z.string(), z.string()).nullable(),
  }).nullable(),
});

export type Brand = z.infer<typeof brandSchema>;

// Schema for creating a brand
export const createBrandSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  logo: updateImageSchema.nullable().optional(),
  isActive: z.boolean().nullable(),
  issueConfiguration: z.object({
    defaultFolders: z.record(z.string(), z.string()).nullable(),
  }),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;

// Schema for updating a brand
export const updateBrandSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  logo: updateImageSchema.nullable().optional(),
  isActive: z.boolean().optional(),
  issueConfiguration: z.object({
    defaultFolders: z.record(z.string(), z.string()).nullable(),
  }),
});

export type UpdateBrand = z.infer<typeof updateBrandSchema>;

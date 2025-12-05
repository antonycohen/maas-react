import * as z from 'zod';
import { ImageSchema } from '../image';

// Reference schema for brand (minimal fields)
export const brandRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type BrandRef = z.infer<typeof brandRefSchema>;

// Full brand schema for read operations
export const brandSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  description: z.string().max(5000).nullable(),
  logo: z.object(ImageSchema).nullable(),
  isActive: z.boolean().nullable(),
  issueCount: z.number().nullable(),
});

export type Brand = z.infer<typeof brandSchema>;

// Schema for creating a brand
export const createBrandSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).nullable().optional(),
  logo: z.object(ImageSchema).nullable().optional(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;

// Schema for updating a brand
export const updateBrandSchema = z.object({
  name: z.string().max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  logo: z.object(ImageSchema).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateBrand = z.infer<typeof updateBrandSchema>;

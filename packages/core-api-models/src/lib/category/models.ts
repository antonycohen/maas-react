import * as z from 'zod';
import { ImageSchema } from '../image';

// Reference schema for parent category (minimal fields)
export const categoryRefSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export type CategoryRef = z.infer<typeof categoryRefSchema>;

// Base category schema without children (to avoid circular reference issues)
const baseCategorySchema = z.object({
  id: z.string(),
  parent: categoryRefSchema.nullable(),
  name: z.string().max(255),
  description: z.string().max(2000).nullable(),
  cover: z.object(ImageSchema).nullable(),
  childrenCount: z.number().nullable(),
});

// Full category schema with children (lazy evaluation for self-reference)
export const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  children: z.lazy(() => z.array(categorySchema)).nullable(),
});

export type Category = z.infer<typeof baseCategorySchema> & {
  children: Category[] | null;
};

// Schema for creating a category
export const createCategorySchema = z.object({
  parent: z.string().nullable(), // parent ID
  name: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  cover: z.object(ImageSchema).nullable().optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;

// Schema for updating a category
export const updateCategorySchema = z.object({
  parent: z.string().nullable().optional(),
  name: z.string().max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  cover: z.object(ImageSchema).nullable().optional(),
});

export type UpdateCategory = z.infer<typeof updateCategorySchema>;

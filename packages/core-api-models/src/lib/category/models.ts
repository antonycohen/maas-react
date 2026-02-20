import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';

export const readCategoryRefSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
});

export const categoryRefSchema = z.object({
    id: z.string(),
});

export type ReadCategoryRef = z.infer<typeof readCategoryRefSchema>;

const readCategorySchema = z.object({
    id: z.string(),
    parent: readCategoryRefSchema.nullable(),
    name: z.string().max(255),
    slug: z.string().max(255).nullable(),
    description: z.string().max(2000).nullable(),
    cover: z.object(readImageSchema).nullable(),
    childrenCount: z.number().nullable(),
});

// Full category schema with children (lazy evaluation for self-reference)
export const categorySchema: z.ZodType<Category> = readCategorySchema.extend({
    children: z.lazy(() => z.array(categorySchema)).nullable(),
});

export type Category = z.infer<typeof readCategorySchema> & {
    children: Category[] | null;
};

// Schema for creating a category
export const createCategorySchema = z.object({
    parent: categoryRefSchema.nullable(),
    name: z.string().min(1).max(255),
    description: z.string().max(2000).nullable().optional(),
    cover: updateImageSchema.nullable().optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;

// Schema for updating a category
export const updateCategorySchema = z.object({
    parent: categoryRefSchema.nullable(),
    name: z.string().min(1).max(255),
    description: z.string().max(2000).nullable().optional(),
    cover: updateImageSchema.nullable().optional(),
});

export type UpdateCategory = z.infer<typeof updateCategorySchema>;

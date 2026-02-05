import * as z from 'zod';
import { planRefSchema } from '../plan';

// Reference schema for product (for writes/updates)
export const productRefSchema = z.object({
    id: z.string(),
});

export type ProductRef = z.infer<typeof productRefSchema>;

// Full product schema for read operations
export const productSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    active: z.boolean().nullable(),
    unitLabel: z.string().nullable(),
    type: z.string().nullable(),
    plan: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
        })
        .nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    quotas: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;

// Schema for creating a product
export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    active: z.boolean().optional().default(true),
    unitLabel: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    plan: planRefSchema,
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    quotas: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreateProduct = z.infer<typeof createProductSchema>;

// Schema for updating a product
export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    active: z.boolean().optional(),
    unitLabel: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    plan: planRefSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    quotas: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;

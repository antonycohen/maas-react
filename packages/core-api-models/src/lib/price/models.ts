import * as z from 'zod';
import { productRefSchema } from '../product';

// Price interval enum
export const priceIntervalEnum = z.enum(['day', 'week', 'month', 'year']);
export type PriceInterval = z.infer<typeof priceIntervalEnum>;

// Price usage type enum
export const priceUsageTypeEnum = z.enum(['licensed', 'metered']);
export type PriceUsageType = z.infer<typeof priceUsageTypeEnum>;

// Reference schema for price (for writes/updates)
export const priceRefSchema = z.object({
    id: z.string(),
});

export type PriceRef = z.infer<typeof priceRefSchema>;

// Full price schema for read operations
export const priceSchema = z.object({
    id: z.string(),
    nickname: z.string().nullable(),
    product: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
        })
        .nullable(),
    currency: z.string().nullable(),
    lookupKey: z.string().nullable(),
    recurringInterval: priceIntervalEnum.nullable(),
    recurringIntervalCount: z.number().nullable(),
    recurringUsageType: priceUsageTypeEnum.nullable(),
    active: z.boolean().nullable(),
    unitAmountInCents: z.number().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    quotas: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type Price = z.infer<typeof priceSchema>;

// Schema for creating a price
export const createPriceSchema = z.object({
    nickname: z.string().nullable().optional(),
    product: productRefSchema,
    currency: z.string().min(1, 'Currency is required'),
    lookupKey: z.string().min(1, 'Lookup key is required'),
    recurringInterval: priceIntervalEnum,
    recurringIntervalCount: z.number().optional(),
    recurringUsageType: priceUsageTypeEnum,
    active: z.boolean().optional().default(true),
    unitAmountInCents: z.number().min(0, 'Amount must be positive'),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    quotas: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreatePrice = z.infer<typeof createPriceSchema>;

// Schema for updating a price
export const updatePriceSchema = z.object({
    nickname: z.string().nullable().optional(),
    lookupKey: z.string().optional(),
    active: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    quotas: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type UpdatePrice = z.infer<typeof updatePriceSchema>;

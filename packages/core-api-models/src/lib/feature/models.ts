import * as z from 'zod';

// Reference schema for feature (for writes/updates)
export const featureRefSchema = z.object({
    id: z.string(),
});

export type FeatureRef = z.infer<typeof featureRefSchema>;

// Full feature schema for read operations
export const featureSchema = z.object({
    id: z.string(),
    lookupKey: z.string().nullable(),
    displayName: z.string().nullable(),
    withQuota: z.boolean().nullable(),
    quotaAggregationFormula: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type Feature = z.infer<typeof featureSchema>;

// Schema for creating a feature
export const createFeatureSchema = z.object({
    lookupKey: z.string().min(1, 'Lookup key is required').max(100),
    displayName: z.string().max(250).nullable().optional(),
    withQuota: z.boolean(),
    quotaAggregationFormula: z.string().nullable().optional(),
});

export type CreateFeature = z.infer<typeof createFeatureSchema>;

// Schema for updating a feature
export const updateFeatureSchema = z.object({
    lookupKey: z.string().max(100).optional(),
    displayName: z.string().max(250).nullable().optional(),
    withQuota: z.boolean().optional(),
    quotaAggregationFormula: z.string().nullable().optional(),
});

export type UpdateFeature = z.infer<typeof updateFeatureSchema>;

// ProductFeature schema - represents the link between a product and a feature
export const productFeatureSchema = z.object({
    id: z.string(), // pf_xxx - use this for detach operations
    productId: z.string(),
    feature: featureSchema,
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type ProductFeature = z.infer<typeof productFeatureSchema>;

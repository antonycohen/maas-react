import * as z from 'zod';

// Status enum
export const diffusionListStatusEnum = z.enum([
    'draft',
    'populating',
    'confirmed',
    'generating',
    'generated',
    'refreshing',
]);
export type DiffusionListStatus = z.infer<typeof diffusionListStatusEnum>;

// Reference schema (for writes/foreign keys)
export const diffusionListRefSchema = z.object({
    id: z.string(),
});

export type DiffusionListRef = z.infer<typeof diffusionListRefSchema>;

// Read reference schema (with display fields)
export const readDiffusionListRefSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
});

export type ReadDiffusionListRef = z.infer<typeof readDiffusionListRefSchema>;

// Feature item schema (used in both read and write)
export const diffusionListFeatureSchema = z.object({
    featureKey: z.string(),
    issueNumber: z.number().int().min(1, 'Issue number is required'),
});

export type DiffusionListFeature = z.infer<typeof diffusionListFeatureSchema>;

// Full read schema
export const diffusionListSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    comments: z.string().nullable(),
    status: diffusionListStatusEnum.nullable(),
    features: z.array(diffusionListFeatureSchema).nullable().optional(),
    entryCount: z.number().int().nullable(),
    needsAttentionCount: z.number().int().nullable(),
    generatedAt: z.string().nullable(),
    pdfDocumentId: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    metadata: z
        .object({
            populateError: z
                .object({
                    message: z.string(),
                    offset: z.number().int(),
                    occurredAt: z.string(),
                })
                .nullable()
                .optional(),
            populateStats: z
                .object({
                    customersProcessed: z.number().int(),
                    entriesInserted: z.number().int(),
                    skippedNoQuota: z.number().int(),
                    skippedExhausted: z.number().int(),
                    skippedDuplicate: z.number().int(),
                })
                .nullable()
                .optional(),
            generateError: z
                .object({
                    message: z.string(),
                    occurredAt: z.string(),
                })
                .nullable()
                .optional(),
        })
        .nullable()
        .optional(),
});

export type DiffusionList = z.infer<typeof diffusionListSchema>;

// Create schema
export const createDiffusionListSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    features: z.array(diffusionListFeatureSchema).min(1, 'At least one feature is required'),
    comments: z.string().max(1000).optional(),
});

export type CreateDiffusionList = z.infer<typeof createDiffusionListSchema>;

// Update schema (draft only)
export const updateDiffusionListSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    features: z.array(diffusionListFeatureSchema).min(1).optional(),
    comments: z.string().max(1000).optional(),
});

export type UpdateDiffusionList = z.infer<typeof updateDiffusionListSchema>;

// Entry feature data (per-customer per-feature)
export const diffusionListEntryFeatureSchema = z.object({
    issueNumber: z.number().int().nullable(),
    hasQuota: z.boolean(),
});

export type DiffusionListEntryFeature = z.infer<typeof diffusionListEntryFeatureSchema>;

// Entry read schema
export const diffusionListEntrySchema = z.object({
    id: z.string(),
    refType: z.string().nullable(),
    refId: z.string().nullable(),
    name: z.string().nullable(),
    address: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    isManual: z.boolean().nullable(),
    features: z.record(z.string(), diffusionListEntryFeatureSchema).nullable().optional(),
    needsAttention: z.boolean().nullable(),
    attentionReason: z.string().nullable(),
});

export type DiffusionListEntry = z.infer<typeof diffusionListEntrySchema>;

// Create entry schema (manual entry — just a customer reference)
export const createDiffusionListEntrySchema = z.object({
    customerId: z.string().min(1, 'Customer is required'),
});

export type CreateDiffusionListEntry = z.infer<typeof createDiffusionListEntrySchema>;

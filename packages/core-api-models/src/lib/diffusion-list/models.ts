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

// Full read schema
export const diffusionListSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    type: z.string().nullable(),
    status: diffusionListStatusEnum.nullable(),
    entryCount: z.number().int().nullable(),
    generatedAt: z.string().nullable(),
    pdfDocumentId: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type DiffusionList = z.infer<typeof diffusionListSchema>;

// Create schema
export const createDiffusionListSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    type: z.string().min(1, 'Type is required'),
});

export type CreateDiffusionList = z.infer<typeof createDiffusionListSchema>;

// Update schema (draft only)
export const updateDiffusionListSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    type: z.string().min(1).optional(),
});

export type UpdateDiffusionList = z.infer<typeof updateDiffusionListSchema>;

// Entry read schema
export const diffusionListEntrySchema = z.object({
    id: z.string(),
    firstName: z.string().nullable(),
    needsAttention: z.boolean().nullable(),
    attentionReason: z.string().nullable(),
    customerId: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressCity: z.string().nullable(),
    addressPostalCode: z.string().nullable(),
    addressCountry: z.string().nullable(),
    isManual: z.boolean().nullable(),
});

export type DiffusionListEntry = z.infer<typeof diffusionListEntrySchema>;

// Create entry schema (manual entry)
export const createDiffusionListEntrySchema = z
    .object({
        firstName: z.string().max(255).optional(),
        lastName: z.string().max(255).optional(),
        email: z.string().email().optional(),
        phone: z.string().max(50).optional(),
        addressLine1: z.string().max(500).optional(),
        addressCity: z.string().max(255).optional(),
        addressPostalCode: z.string().max(20).optional(),
        addressCountry: z.string().max(2).optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined && v !== ''), {
        message: 'At least one field is required',
    });

export type CreateDiffusionListEntry = z.infer<typeof createDiffusionListEntrySchema>;

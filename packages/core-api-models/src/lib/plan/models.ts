import * as z from 'zod';

// Reference schema for plan (for writes/updates)
export const planRefSchema = z.object({
    id: z.string(),
});

export type PlanRef = z.infer<typeof planRefSchema>;

// Full plan schema for read operations
export const planSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    active: z.boolean().nullable(),
    portalConfigurationId: z.string().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type Plan = z.infer<typeof planSchema>;

// Schema for creating a plan
export const createPlanSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    active: z.boolean().optional().default(true),
    portalConfigurationId: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreatePlan = z.infer<typeof createPlanSchema>;

// Schema for updating a plan
export const updatePlanSchema = z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    active: z.boolean().optional(),
    portalConfigurationId: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type UpdatePlan = z.infer<typeof updatePlanSchema>;

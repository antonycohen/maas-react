import * as z from 'zod';

export const quotaStatusEnum = z.enum(['active', 'inactive']);
export type QuotaStatus = z.infer<typeof quotaStatusEnum>;

export const quotaAggregationTypeEnum = z.enum(['count', 'sum']);
export type QuotaAggregationType = z.infer<typeof quotaAggregationTypeEnum>;

export const quotaSchema = z.object({
    id: z.string(),
    featureKey: z.string().nullable(),
    aggregationType: quotaAggregationTypeEnum.nullable(),
    status: quotaStatusEnum.nullable(),
    periodStart: z.string().nullable(),
    periodEnd: z.string().nullable(),
    quotaLimit: z.number().nullable(),
    currentUsage: z.number().nullable(),
    createdAt: z.string().nullable(),
});

export type Quota = z.infer<typeof quotaSchema>;

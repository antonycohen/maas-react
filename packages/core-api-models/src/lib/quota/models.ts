import * as z from 'zod';

export const quotaStatusEnum = z.enum(['active', 'inactive']);
export type QuotaStatus = z.infer<typeof quotaStatusEnum>;

export const quotaAggregationTypeEnum = z.enum(['count', 'sum', 'last']);
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

export const quotaTransactionOperationTypeEnum = z.enum(['allocate', 'consume', 'adjust', 'refund', 'reset']);
export type QuotaTransactionOperationType = z.infer<typeof quotaTransactionOperationTypeEnum>;

export const quotaTransactionSchema = z.object({
    id: z.string(),
    amount: z.number(),
    operationType: quotaTransactionOperationTypeEnum,
    description: z.string().nullable(),
    quota: z
        .object({
            id: z.string(),
            featureKey: z.string().nullable(),
            quotaLimit: z.number().nullable(),
            currentUsage: z.number().nullable(),
        })
        .nullable()
        .optional(),
    referenceType: z.string().nullable().optional(),
    referenceId: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    createdAt: z.string().nullable(),
});

export type QuotaTransaction = z.infer<typeof quotaTransactionSchema>;

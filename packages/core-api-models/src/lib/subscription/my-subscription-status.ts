import * as z from 'zod';

export const subscriptionQuotaSchema = z.object({
    featureKey: z.string(),
    quotaLimit: z.number(),
    currentUsage: z.number(),
    remaining: z.number(),
});

export type SubscriptionQuota = z.infer<typeof subscriptionQuotaSchema>;

export const mySubscriptionStatusSchema = z.object({
    isSubscribed: z.boolean(),
    status: z.string().nullable(),
    subscriptionId: z.string().nullable(),
    quotas: z.array(subscriptionQuotaSchema),
});

export type MySubscriptionStatus = z.infer<typeof mySubscriptionStatusSchema>;

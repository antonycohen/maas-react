import * as z from 'zod';

// Subscription status enum
export const subscriptionStatusEnum = z.enum([
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
    'incomplete_expired',
    'paused',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusEnum>;

// Collection method enum
export const collectionMethodEnum = z.enum(['charge_automatically', 'send_invoice']);
export type CollectionMethod = z.infer<typeof collectionMethodEnum>;

// Subscription item schema
export const subscriptionItemSchema = z.object({
    id: z.string(),
    priceId: z.string().nullable(),
    quantity: z.number().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
});

export type SubscriptionItem = z.infer<typeof subscriptionItemSchema>;

// Full subscription schema for read operations
export const subscriptionSchema = z.object({
    id: z.string(),
    customer: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string().nullable(),
        })
        .nullable(),
    status: subscriptionStatusEnum.nullable(),
    currentPeriodStart: z.string().nullable(),
    currentPeriodEnd: z.string().nullable(),
    cancelAtPeriodEnd: z.boolean().nullable(),
    canceledAt: z.string().nullable(),
    cancelAt: z.string().nullable(),
    endedAt: z.string().nullable(),
    startDate: z.string().nullable(),
    trialStart: z.string().nullable(),
    trialEnd: z.string().nullable(),
    collectionMethod: collectionMethodEnum.nullable(),
    currency: z.string().nullable(),
    description: z.string().nullable(),
    plan: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
        })
        .nullable(),
    items: z.array(subscriptionItemSchema).nullable(),
    refType: z.string().nullable(),
    refId: z.string().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

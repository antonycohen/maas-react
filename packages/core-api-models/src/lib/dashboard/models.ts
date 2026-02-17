import * as z from 'zod';

// Subscription stats by status
export const dashboardSubscriptionsSchema = z.object({
    total: z.number().nullable(),
    active: z.number().nullable(),
    pastDue: z.number().nullable(),
    canceled: z.number().nullable(),
    unpaid: z.number().nullable(),
    incomplete: z.number().nullable(),
    incompleteExpired: z.number().nullable(),
    paused: z.number().nullable(),
    cancelPending: z.number().nullable(),
});

export type DashboardSubscriptions = z.infer<typeof dashboardSubscriptionsSchema>;

// Revenue per plan
export const dashboardRevenuePlanSchema = z.object({
    planId: z.string().nullable(),
    mrr: z.number().nullable(),
    currency: z.string().nullable(),
    subscriptionCount: z.number().nullable(),
    recurringInterval: z.string().nullable(),
    recurringIntervalCount: z.number().nullable(),
});

export type DashboardRevenuePlan = z.infer<typeof dashboardRevenuePlanSchema>;

// Revenue overview
export const dashboardRevenueSchema = z.object({
    mrr: z.number().nullable(),
    currency: z.string().nullable(),
    byPlan: z.array(dashboardRevenuePlanSchema).nullable(),
});

export type DashboardRevenue = z.infer<typeof dashboardRevenueSchema>;

// Churn stats
export const dashboardChurnSchema = z.object({
    canceledThisMonth: z.number().nullable(),
    cancelPendingCount: z.number().nullable(),
});

export type DashboardChurn = z.infer<typeof dashboardChurnSchema>;

// Customer stats
export const dashboardCustomersSchema = z.object({
    total: z.number().nullable(),
});

export type DashboardCustomers = z.infer<typeof dashboardCustomersSchema>;

// Full dashboard stats (top-level response)
export const dashboardStatsSchema = z.object({
    subscriptions: dashboardSubscriptionsSchema.nullable(),
    revenue: dashboardRevenueSchema.nullable(),
    churn: dashboardChurnSchema.nullable(),
    customers: dashboardCustomersSchema.nullable(),
    lastUpdatedAt: z.string().nullable(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

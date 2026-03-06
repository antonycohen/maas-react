import * as z from 'zod';

// ── Module 1: Subscriptions & Revenue ──

export const dashboardSubscriptionsSchema = z.object({
    total: z.number().nullable(),
    active: z.number().nullable(),
    pastDue: z.number().nullable(),
    canceled: z.number().nullable(),
    unpaid: z.number().nullable(),
    incomplete: z.number().nullable(),
    paused: z.number().nullable(),
    cancelPending: z.number().nullable(),
    newInPeriod: z.number().nullable(),
});

export type DashboardSubscriptions = z.infer<typeof dashboardSubscriptionsSchema>;

export const dashboardRevenuePlanSchema = z.object({
    planId: z.string().nullable(),
    planName: z.string().nullable(),
    mrr: z.number().nullable(),
    currency: z.string().nullable(),
    subscriptionCount: z.number().nullable(),
});

export type DashboardRevenuePlan = z.infer<typeof dashboardRevenuePlanSchema>;

export const dashboardRevenueSchema = z.object({
    mrr: z.number().nullable(),
    arr: z.number().nullable(),
    currency: z.string().nullable(),
    collectedInPeriod: z.number().nullable(),
    outstanding: z.number().nullable(),
    byPlan: z.array(dashboardRevenuePlanSchema).nullable(),
});

export type DashboardRevenue = z.infer<typeof dashboardRevenueSchema>;

export const dashboardInvoicesSchema = z.object({
    byStatus: z.record(z.string(), z.number()).nullable(),
    overdue: z.number().nullable(),
});

export type DashboardInvoices = z.infer<typeof dashboardInvoicesSchema>;

export const dashboardChurnSchema = z.object({
    canceledInPeriod: z.number().nullable(),
    cancelPendingCount: z.number().nullable(),
    churnRatePercent: z.number().nullable(),
    netGrowth: z.number().nullable(),
});

export type DashboardChurn = z.infer<typeof dashboardChurnSchema>;

export const dashboardCustomersSchema = z.object({
    total: z.number().nullable(),
    delinquent: z.number().nullable(),
});

export type DashboardCustomers = z.infer<typeof dashboardCustomersSchema>;

export const dashboardSubscriptionModuleSchema = z.object({
    subscriptions: dashboardSubscriptionsSchema.nullable(),
    revenue: dashboardRevenueSchema.nullable(),
    invoices: dashboardInvoicesSchema.nullable(),
    churn: dashboardChurnSchema.nullable(),
    customers: dashboardCustomersSchema.nullable(),
});

export type DashboardSubscriptionModule = z.infer<typeof dashboardSubscriptionModuleSchema>;

// ── Module 2: Content ──

export const dashboardArticlesSchema = z.object({
    total: z.number().nullable(),
    published: z.number().nullable(),
    draft: z.number().nullable(),
    featured: z.number().nullable(),
    publishedInPeriod: z.number().nullable(),
});

export type DashboardArticles = z.infer<typeof dashboardArticlesSchema>;

export const dashboardContentModuleSchema = z.object({
    articles: dashboardArticlesSchema.nullable(),
    topAuthors: z
        .array(
            z.object({
                authorId: z.string().nullable(),
                authorName: z.string().nullable(),
                articleCount: z.number().nullable(),
            })
        )
        .nullable(),
    topCategories: z
        .array(
            z.object({
                categoryId: z.string().nullable(),
                categoryName: z.string().nullable(),
                articleCount: z.number().nullable(),
            })
        )
        .nullable(),
    folders: z.object({ total: z.number().nullable() }).nullable(),
});

export type DashboardContentModule = z.infer<typeof dashboardContentModuleSchema>;

// ── Module 3: Magazine ──

export const dashboardIssuesSchema = z.object({
    total: z.number().nullable(),
    published: z.number().nullable(),
    unpublished: z.number().nullable(),
    publishedInPeriod: z.number().nullable(),
    averagePageCount: z.number().nullable(),
});

export type DashboardIssues = z.infer<typeof dashboardIssuesSchema>;

export const dashboardResizedImageSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    mode: z.string(),
});

export const dashboardCoverSchema = z.object({
    id: z.string().nullable(),
    downloadUrl: z.string().nullable(),
    originalFilename: z.string().nullable(),
    resizedImages: z.array(dashboardResizedImageSchema).nullable(),
});

export type DashboardCover = z.infer<typeof dashboardCoverSchema>;

export const dashboardLatestIssueSchema = z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    issueNumber: z.string().nullable(),
    publishedAt: z.string().nullable(),
    pageCount: z.number().nullable(),
    coverId: z.string().nullable(),
    cover: dashboardCoverSchema.nullable(),
    brandId: z.string().nullable(),
});

export type DashboardLatestIssue = z.infer<typeof dashboardLatestIssueSchema>;

export const dashboardMagazineModuleSchema = z.object({
    issues: dashboardIssuesSchema.nullable(),
    byBrand: z
        .array(
            z.object({
                brandId: z.string().nullable(),
                brandName: z.string().nullable(),
                issueCount: z.number().nullable(),
            })
        )
        .nullable(),
    latestIssue: dashboardLatestIssueSchema.nullable(),
});

export type DashboardMagazineModule = z.infer<typeof dashboardMagazineModuleSchema>;

// ── Module 4: Diffusion ──

export const dashboardDiffusionModuleSchema = z.object({
    lists: z
        .object({
            total: z.number().nullable(),
            byStatus: z.record(z.string(), z.number()).nullable(),
        })
        .nullable(),
    entries: z
        .object({
            total: z.number().nullable(),
            manual: z.number().nullable(),
            auto: z.number().nullable(),
        })
        .nullable(),
});

export type DashboardDiffusionModule = z.infer<typeof dashboardDiffusionModuleSchema>;

// ── Module 5: Subscribers ──

export const dashboardSubscribersModuleSchema = z.object({
    customers: z
        .object({
            total: z.number().nullable(),
            withActiveSubscription: z.number().nullable(),
            withoutActiveSubscription: z.number().nullable(),
            delinquent: z.number().nullable(),
            newInPeriod: z.number().nullable(),
        })
        .nullable(),
});

export type DashboardSubscribersModule = z.infer<typeof dashboardSubscribersModuleSchema>;

// ── Full Dashboard (overview endpoint) ──

export const dashboardOverviewSchema = z.object({
    subscriptions: dashboardSubscriptionModuleSchema.nullable(),
    content: dashboardContentModuleSchema.nullable(),
    magazine: dashboardMagazineModuleSchema.nullable(),
    diffusion: dashboardDiffusionModuleSchema.nullable(),
    subscribers: dashboardSubscribersModuleSchema.nullable(),
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
    lastUpdatedAt: z.string().nullable(),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;

// Keep backward compat alias
export type DashboardStats = DashboardOverview;

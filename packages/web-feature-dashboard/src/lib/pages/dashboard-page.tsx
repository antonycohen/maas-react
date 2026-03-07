import { useGetDashboardStats } from '@maas/core-api';
import {
    DashboardRevenuePlan,
    DashboardSubscriptionModule,
    DashboardContentModule,
    DashboardMagazineModule,
    DashboardDiffusionModule,
    DashboardSubscribersModule,
    DashboardLatestIssue,
} from '@maas/core-api-models';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Skeleton,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import {
    IconCreditCard,
    IconUsers,
    IconCurrencyEuro,
    IconTrendingDown,
    IconClock,
    IconRefresh,
    IconFileText,
    IconBook,
    IconSend,
    IconAlertTriangle,
    IconTrendingUp,
    IconReceipt,
    IconStar,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getDashboardStats } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';

// ── Helpers ──

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
    const key = `${locale}-${currency}`;
    if (!numberFormatCache.has(key)) {
        numberFormatCache.set(key, new Intl.NumberFormat(locale, { style: 'currency', currency }));
    }
    return numberFormatCache.get(key)!;
};

const formatCurrency = (amountInCents: number | null, currency: string | null): string => {
    if (amountInCents == null) return '-';
    return getCurrencyFormatter(navigator.language, currency ?? 'EUR').format(amountInCents / 100);
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(navigator.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(dateString)
    );
};

// ── Shared Components ──

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    variant,
}: {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'warning' | 'success';
}) {
    const valueColorClass = variant === 'warning' ? 'text-amber-600' : variant === 'success' ? 'text-emerald-600' : '';
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="text-muted-foreground h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${valueColorClass}`}>{value}</div>
                {description && <CardDescription className="mt-1">{description}</CardDescription>}
            </CardContent>
        </Card>
    );
}

function SectionHeader({ title }: { title: string }) {
    return <h2 className="text-lg font-semibold tracking-tight">{title}</h2>;
}

function StatusBreakdown({ items }: { items: { label: string; value: number | null | undefined; color: string }[] }) {
    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <span className="text-muted-foreground text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value ?? 0}</span>
                </div>
            ))}
        </div>
    );
}

// ── Module 1: Subscriptions & Revenue ──

function SubscriptionsSection({ data }: { data: DashboardSubscriptionModule }) {
    const { t } = useTranslation();
    const subs = data.subscriptions;
    const revenue = data.revenue;
    const churn = data.churn;

    const statusItems = [
        { label: t('dashboard.statusActive'), value: subs?.active, color: 'bg-emerald-500' },
        { label: t('dashboard.statusPastDue'), value: subs?.pastDue, color: 'bg-amber-500' },
        { label: t('dashboard.statusCanceled'), value: subs?.canceled, color: 'bg-red-500' },
        { label: t('dashboard.statusUnpaid'), value: subs?.unpaid, color: 'bg-red-400' },
        { label: t('dashboard.statusIncomplete'), value: subs?.incomplete, color: 'bg-orange-400' },
        { label: t('dashboard.statusPaused'), value: subs?.paused, color: 'bg-blue-400' },
        { label: t('dashboard.statusCancelPending'), value: subs?.cancelPending, color: 'bg-yellow-500' },
    ];

    return (
        <div className="space-y-4">
            <SectionHeader title={t('dashboard.sectionSubscriptions')} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('dashboard.totalSubscriptions')}
                    value={subs?.total ?? 0}
                    description={t('dashboard.newInPeriod', { count: subs?.newInPeriod ?? 0 })}
                    icon={IconCreditCard}
                />
                <StatCard
                    title={t('dashboard.mrr')}
                    value={formatCurrency(revenue?.mrr ?? null, revenue?.currency ?? 'EUR')}
                    description={`${t('dashboard.arrLabel')}: ${formatCurrency(revenue?.arr ?? null, revenue?.currency ?? 'EUR')}`}
                    icon={IconCurrencyEuro}
                />
                <StatCard
                    title={t('dashboard.collectedInPeriod')}
                    value={formatCurrency(revenue?.collectedInPeriod ?? null, revenue?.currency ?? 'EUR')}
                    description={`${t('dashboard.outstanding')}: ${formatCurrency(revenue?.outstanding ?? null, revenue?.currency ?? 'EUR')}`}
                    icon={IconReceipt}
                />
                <StatCard
                    title={t('dashboard.churnThisMonth')}
                    value={churn?.canceledInPeriod ?? 0}
                    description={`${t('dashboard.churnRate')}: ${churn?.churnRatePercent ?? 0}% · ${t('dashboard.netGrowth')}: ${churn?.netGrowth ?? 0}`}
                    icon={IconTrendingDown}
                    variant={(churn?.netGrowth ?? 0) < 0 ? 'warning' : undefined}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.subscriptionBreakdown')}</CardTitle>
                        <CardDescription>{t('dashboard.distributionByStatus')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StatusBreakdown items={statusItems} />
                    </CardContent>
                </Card>
                {revenue?.byPlan && revenue.byPlan.length > 0 && (
                    <RevenuePlanBreakdown plans={revenue.byPlan} currency={revenue.currency} />
                )}
            </div>
            {(data.invoices?.overdue ?? 0) > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="flex items-center gap-3 pt-4">
                        <IconAlertTriangle className="h-5 w-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                            {t('dashboard.overdueInvoices')}: {data.invoices?.overdue}
                        </span>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function RevenuePlanBreakdown({ plans, currency }: { plans: DashboardRevenuePlan[]; currency: string | null }) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.revenueByPlan')}</CardTitle>
                <CardDescription>{t('dashboard.revenueByPlanDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.planId} className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{plan.planName ?? plan.planId ?? '-'}</span>
                                <span className="text-muted-foreground text-xs">
                                    {t('dashboard.subscriptions', { count: plan.subscriptionCount ?? 0 })}
                                    {plan.recurringInterval && (
                                        <>
                                            {' · '}
                                            {(plan.recurringIntervalCount ?? 1) > 1
                                                ? t('dashboard.intervalEveryN', {
                                                      count: plan.recurringIntervalCount,
                                                      interval: t(`dashboard.interval.${plan.recurringInterval}`),
                                                  })
                                                : t(`dashboard.interval.${plan.recurringInterval}`)}
                                        </>
                                    )}
                                </span>
                            </div>
                            <span className="text-sm font-semibold">{formatCurrency(plan.mrr, currency)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Module 2: Content ──

function ContentSection({ data }: { data: DashboardContentModule }) {
    const { t } = useTranslation();
    const articles = data.articles;

    return (
        <div className="space-y-4">
            <SectionHeader title={t('dashboard.sectionContent')} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('dashboard.totalArticles')}
                    value={articles?.total ?? 0}
                    description={`${articles?.published ?? 0} ${t('dashboard.publishedArticles').toLowerCase()}`}
                    icon={IconFileText}
                />
                <StatCard
                    title={t('dashboard.publishedInPeriod')}
                    value={articles?.publishedInPeriod ?? 0}
                    icon={IconTrendingUp}
                />
                <StatCard title={t('dashboard.featuredArticles')} value={articles?.featured ?? 0} icon={IconStar} />
                <StatCard title={t('dashboard.totalFolders')} value={data.folders?.total ?? 0} icon={IconBook} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {data.topAuthors && data.topAuthors.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.topAuthors')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.topAuthors.map((author, i) => (
                                    <div key={author.authorId ?? i} className="flex items-center justify-between">
                                        <span className="text-muted-foreground truncate text-sm">
                                            {author.authorName ?? author.authorId ?? '-'}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {t('dashboard.articles', { count: author.articleCount ?? 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {data.topCategories && data.topCategories.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.topCategories')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.topCategories.map((cat, i) => (
                                    <div key={cat.categoryId ?? i} className="flex items-center justify-between">
                                        <span className="text-muted-foreground truncate text-sm">
                                            {cat.categoryName ?? cat.categoryId ?? '-'}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {t('dashboard.articles', { count: cat.articleCount ?? 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// ── Module 3: Magazine ──

function MagazineSection({ data }: { data: DashboardMagazineModule }) {
    const { t } = useTranslation();
    const issues = data.issues;

    return (
        <div className="space-y-4">
            <SectionHeader title={t('dashboard.sectionMagazine')} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('dashboard.totalIssues')}
                    value={issues?.total ?? 0}
                    description={`${issues?.published ?? 0} ${t('dashboard.publishedIssues').toLowerCase()}`}
                    icon={IconBook}
                />
                <StatCard
                    title={t('dashboard.publishedInPeriod')}
                    value={issues?.publishedInPeriod ?? 0}
                    icon={IconTrendingUp}
                />
                <StatCard
                    title={t('dashboard.averagePageCount')}
                    value={issues?.averagePageCount ?? 0}
                    icon={IconFileText}
                />
                <StatCard title={t('dashboard.unpublishedIssues')} value={issues?.unpublished ?? 0} icon={IconClock} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {data.latestIssue && <LatestIssueCard issue={data.latestIssue} />}
                {data.byBrand && data.byBrand.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.issuesByBrand')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.byBrand.map((brand, i) => (
                                    <div key={brand.brandId ?? i} className="flex items-center justify-between">
                                        <span className="text-muted-foreground truncate text-sm">
                                            {brand.brandName ?? brand.brandId ?? '-'}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {t('dashboard.issues', { count: brand.issueCount ?? 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function LatestIssueCard({ issue }: { issue: DashboardLatestIssue }) {
    const { t } = useTranslation();

    const coverUrl =
        issue.cover?.resizedImages?.find((img) => img.width === 960)?.url ??
        issue.cover?.resizedImages?.[0]?.url ??
        issue.cover?.downloadUrl ??
        null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.latestIssue')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    {coverUrl && (
                        <div className="relative aspect-[270/380] w-28 shrink-0 overflow-hidden rounded-sm shadow-sm">
                            <img
                                src={coverUrl}
                                alt={issue.title ?? ''}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-center space-y-2">
                        <p className="text-lg font-semibold">{issue.title}</p>
                        {issue.issueNumber && (
                            <p className="text-muted-foreground text-sm">
                                {t('dashboard.issueNumber', { number: issue.issueNumber })}
                            </p>
                        )}
                        <div className="text-muted-foreground flex gap-4 text-sm">
                            {issue.publishedAt && <span>{formatDate(issue.publishedAt)}</span>}
                            {issue.pageCount != null && (
                                <span>{t('dashboard.pageCount', { count: issue.pageCount })}</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Module 4: Diffusion ──

function DiffusionSection({ data }: { data: DashboardDiffusionModule }) {
    const { t } = useTranslation();

    const statusItems = Object.entries(data.lists?.byStatus ?? {}).map(([status, count]) => ({
        label: status,
        value: count,
        color:
            status === 'generated'
                ? 'bg-emerald-500'
                : status === 'confirmed'
                  ? 'bg-blue-500'
                  : status === 'draft'
                    ? 'bg-gray-400'
                    : 'bg-amber-500',
    }));

    return (
        <div className="space-y-4">
            <SectionHeader title={t('dashboard.sectionDiffusion')} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title={t('dashboard.totalLists')} value={data.lists?.total ?? 0} icon={IconSend} />
                <StatCard title={t('dashboard.totalEntries')} value={data.entries?.total ?? 0} icon={IconUsers} />
                <StatCard title={t('dashboard.manualEntries')} value={data.entries?.manual ?? 0} icon={IconUsers} />
                <StatCard title={t('dashboard.autoEntries')} value={data.entries?.auto ?? 0} icon={IconUsers} />
            </div>
            {statusItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.listsByStatus')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusBreakdown items={statusItems} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// ── Module 5: Subscribers ──

function SubscribersSection({ data }: { data: DashboardSubscribersModule }) {
    const { t } = useTranslation();
    const customers = data.customers;

    return (
        <div className="space-y-4">
            <SectionHeader title={t('dashboard.sectionSubscribers')} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title={t('dashboard.totalCustomers')} value={customers?.total ?? 0} icon={IconUsers} />
                <StatCard
                    title={t('dashboard.withActiveSubscription')}
                    value={customers?.withActiveSubscription ?? 0}
                    icon={IconCreditCard}
                    variant="success"
                />
                <StatCard
                    title={t('dashboard.withoutActiveSubscription')}
                    value={customers?.withoutActiveSubscription ?? 0}
                    icon={IconAlertTriangle}
                    variant={(customers?.withoutActiveSubscription ?? 0) > 0 ? 'warning' : undefined}
                />
                <StatCard
                    title={t('dashboard.newCustomersInPeriod')}
                    value={customers?.newInPeriod ?? 0}
                    icon={IconTrendingUp}
                />
            </div>
            {(customers?.delinquent ?? 0) > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="flex items-center gap-3 pt-4">
                        <IconAlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                            {t('dashboard.delinquent')}: {customers?.delinquent}
                        </span>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// ── Loading Skeleton ──

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, section) => (
                <div key={section} className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-4 w-24" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="mt-2 h-3 w-20" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Page ──

export function DashboardPage() {
    const { t } = useTranslation();
    const routes = useRoutes();
    const { data: stats, isLoading, isError } = useGetDashboardStats();
    const queryClient = useQueryClient();
    const [isReloading, setIsReloading] = useState(false);

    const handleReload = useCallback(async () => {
        setIsReloading(true);
        try {
            const freshStats = await getDashboardStats({ forceReload: true });
            queryClient.setQueryData(['dashboard', undefined], freshStats);
        } catch {
            // Reload failed silently, user can retry
        } finally {
            setIsReloading(false);
        }
    }, [queryClient]);

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('dashboard.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('dashboard.title')}
                    pageDescription={t('dashboard.description')}
                    actions={
                        <Button variant="outline" size="sm" onClick={handleReload} disabled={isReloading}>
                            <IconRefresh className={`mr-2 h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
                            {isReloading ? t('common.reloading') : t('common.reload')}
                        </Button>
                    }
                />

                {isLoading && <DashboardSkeleton />}

                {isError && (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm">{t('common.errorLoading')}</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={handleReload}>
                            {t('common.reload')}
                        </Button>
                    </div>
                )}

                {stats && (
                    <Tabs defaultValue="all" className="mt-6">
                        <TabsList>
                            <TabsTrigger value="all">{t('dashboard.tabAll')}</TabsTrigger>
                            <TabsTrigger value="subscriptions">{t('dashboard.tabSubscriptions')}</TabsTrigger>
                            <TabsTrigger value="content">{t('dashboard.tabContent')}</TabsTrigger>
                            <TabsTrigger value="magazine">{t('dashboard.tabMagazine')}</TabsTrigger>
                            <TabsTrigger value="diffusion">{t('dashboard.tabDiffusion')}</TabsTrigger>
                            <TabsTrigger value="subscribers">{t('dashboard.tabSubscribers')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-10">
                            {stats.subscriptions && <SubscriptionsSection data={stats.subscriptions} />}
                            {stats.content && <ContentSection data={stats.content} />}
                            {stats.magazine && <MagazineSection data={stats.magazine} />}
                            {stats.diffusion && <DiffusionSection data={stats.diffusion} />}
                            {stats.subscribers && <SubscribersSection data={stats.subscribers} />}
                        </TabsContent>

                        <TabsContent value="subscriptions">
                            {stats.subscriptions && <SubscriptionsSection data={stats.subscriptions} />}
                        </TabsContent>

                        <TabsContent value="content">
                            {stats.content && <ContentSection data={stats.content} />}
                        </TabsContent>

                        <TabsContent value="magazine">
                            {stats.magazine && <MagazineSection data={stats.magazine} />}
                        </TabsContent>

                        <TabsContent value="diffusion">
                            {stats.diffusion && <DiffusionSection data={stats.diffusion} />}
                        </TabsContent>

                        <TabsContent value="subscribers">
                            {stats.subscribers && <SubscribersSection data={stats.subscribers} />}
                        </TabsContent>

                        {stats.lastUpdatedAt && (
                            <div className="text-muted-foreground mt-6 flex items-center gap-1.5 text-xs">
                                <IconClock className="h-3.5 w-3.5" />
                                <span>{t('dashboard.lastUpdated', { date: formatDate(stats.lastUpdatedAt) })}</span>
                            </div>
                        )}
                    </Tabs>
                )}
            </LayoutContent>
        </div>
    );
}

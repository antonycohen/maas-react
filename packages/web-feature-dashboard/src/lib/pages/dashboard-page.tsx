import { useGetDashboardStats } from '@maas/core-api';
import { DashboardRevenuePlan, DashboardStats } from '@maas/core-api-models';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import {
    IconCreditCard,
    IconUsers,
    IconCurrencyEuro,
    IconTrendingDown,
    IconClock,
    IconRefresh,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getDashboardStats } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
    const key = `${locale}-${currency}`;
    if (!numberFormatCache.has(key)) {
        numberFormatCache.set(key, new Intl.NumberFormat(locale, { style: 'currency', currency }));
    }
    return numberFormatCache.get(key)!;
};

const formatCurrency = (amountInCents: number | null, currency: string | null, locale?: string): string => {
    if (amountInCents == null) return '-';
    return getCurrencyFormatter(locale ?? navigator.language, currency ?? 'EUR').format(amountInCents / 100);
};

const formatDate = (dateString: string | null, locale?: string): string => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(locale ?? navigator.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="text-muted-foreground h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <CardDescription className="mt-1">{description}</CardDescription>}
            </CardContent>
        </Card>
    );
}

function SubscriptionBreakdown({ stats }: { stats: DashboardStats }) {
    const { t } = useTranslation();
    const subscriptions = stats.subscriptions;
    if (!subscriptions) return null;

    const items = [
        { label: t('dashboard.statusActive'), value: subscriptions.active, color: 'bg-emerald-500' },
        { label: t('dashboard.statusPastDue'), value: subscriptions.pastDue, color: 'bg-amber-500' },
        { label: t('dashboard.statusCanceled'), value: subscriptions.canceled, color: 'bg-red-500' },
        { label: t('dashboard.statusUnpaid'), value: subscriptions.unpaid, color: 'bg-red-400' },
        { label: t('dashboard.statusIncomplete'), value: subscriptions.incomplete, color: 'bg-orange-400' },
        {
            label: t('dashboard.statusIncompleteExpired'),
            value: subscriptions.incompleteExpired,
            color: 'bg-gray-400',
        },
        { label: t('dashboard.statusPaused'), value: subscriptions.paused, color: 'bg-blue-400' },
        { label: t('dashboard.statusCancelPending'), value: subscriptions.cancelPending, color: 'bg-yellow-500' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.subscriptionBreakdown')}</CardTitle>
                <CardDescription>{t('dashboard.distributionByStatus')}</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}

function RevenuePlanBreakdown({ plans, currency }: { plans: DashboardRevenuePlan[]; currency: string | null }) {
    const { t } = useTranslation();

    const formatInterval = (interval: string | null, count: number | null): string => {
        if (!interval) return '';
        const c = count ?? 1;
        if (interval === 'month' && c === 1) return t('dashboard.intervalMonthly');
        if (interval === 'year' && c === 1) return t('dashboard.intervalYearly');
        if (c === 1) return t('dashboard.intervalEvery', { interval });
        return t('dashboard.intervalEveryCount', { count: c, interval });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.revenueByPlan')}</CardTitle>
                <CardDescription>{t('dashboard.revenueByPlanDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div
                            key={`${plan.planId}-${plan.recurringInterval}-${plan.recurringIntervalCount}`}
                            className="flex items-center justify-between"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{plan.planId}</span>
                                    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                                        {formatInterval(plan.recurringInterval, plan.recurringIntervalCount)}
                                    </span>
                                </div>
                                <span className="text-muted-foreground text-xs">
                                    {t('dashboard.subscriptions', { count: plan.subscriptionCount ?? 0 })}
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

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
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
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

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
                    <div className="mt-6 space-y-6">
                        {/* Top-level stat cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title={t('dashboard.totalSubscriptions')}
                                value={stats.subscriptions?.total ?? 0}
                                description={t('dashboard.active', { count: stats.subscriptions?.active ?? 0 })}
                                icon={IconCreditCard}
                            />
                            <StatCard
                                title={t('dashboard.mrr')}
                                value={formatCurrency(stats.revenue?.mrr ?? null, stats.revenue?.currency ?? 'EUR')}
                                description={t('dashboard.mrrLabel')}
                                icon={IconCurrencyEuro}
                            />
                            <StatCard
                                title={t('dashboard.totalCustomers')}
                                value={stats.customers?.total ?? 0}
                                icon={IconUsers}
                            />
                            <StatCard
                                title={t('dashboard.churnThisMonth')}
                                value={stats.churn?.canceledThisMonth ?? 0}
                                description={t('dashboard.cancelPending', {
                                    count: stats.churn?.cancelPendingCount ?? 0,
                                })}
                                icon={IconTrendingDown}
                            />
                        </div>

                        {/* Detail cards */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <SubscriptionBreakdown stats={stats} />
                            {stats.revenue?.byPlan && stats.revenue.byPlan.length > 0 && (
                                <RevenuePlanBreakdown plans={stats.revenue.byPlan} currency={stats.revenue.currency} />
                            )}
                        </div>

                        {/* Last updated */}
                        {stats.lastUpdatedAt && (
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <IconClock className="h-3.5 w-3.5" />
                                <span>{t('dashboard.lastUpdated', { date: formatDate(stats.lastUpdatedAt) })}</span>
                            </div>
                        )}
                    </div>
                )}
            </LayoutContent>
        </div>
    );
}

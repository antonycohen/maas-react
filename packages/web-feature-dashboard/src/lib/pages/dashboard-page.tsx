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

const formatCurrency = (amountInCents: number | null, currency: string | null): string => {
    if (amountInCents == null) return '-';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency ?? 'EUR',
    }).format(amountInCents / 100);
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dateString));
};

const formatInterval = (interval: string | null, count: number | null): string => {
    if (!interval) return '';
    const c = count ?? 1;
    if (interval === 'month' && c === 1) return 'Monthly';
    if (interval === 'year' && c === 1) return 'Yearly';
    if (c === 1) return `Every ${interval}`;
    return `Every ${c} ${interval}s`;
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
    const subscriptions = stats.subscriptions;
    if (!subscriptions) return null;

    const items = [
        { label: 'Active', value: subscriptions.active, color: 'bg-emerald-500' },
        { label: 'Past Due', value: subscriptions.pastDue, color: 'bg-amber-500' },
        { label: 'Canceled', value: subscriptions.canceled, color: 'bg-red-500' },
        { label: 'Unpaid', value: subscriptions.unpaid, color: 'bg-red-400' },
        { label: 'Incomplete', value: subscriptions.incomplete, color: 'bg-orange-400' },
        { label: 'Incomplete Expired', value: subscriptions.incompleteExpired, color: 'bg-gray-400' },
        { label: 'Paused', value: subscriptions.paused, color: 'bg-blue-400' },
        { label: 'Cancel Pending', value: subscriptions.cancelPending, color: 'bg-yellow-500' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription Breakdown</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>MRR breakdown per plan and billing interval</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {plans.map((plan, index) => (
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
                                    {plan.subscriptionCount ?? 0} subscriptions
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
    const { data: stats, isLoading } = useGetDashboardStats();
    const queryClient = useQueryClient();
    const [isReloading, setIsReloading] = useState(false);

    const handleReload = useCallback(async () => {
        setIsReloading(true);
        try {
            const freshStats = await getDashboardStats({ forceReload: true });
            queryClient.setQueryData(['dashboard', undefined], freshStats);
        } finally {
            setIsReloading(false);
        }
    }, [queryClient]);

    return (
        <div>
            <header>
                <LayoutBreadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]} />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle="Dashboard"
                    pageDescription="Overview of your subscription business"
                    actions={
                        <Button variant="outline" size="sm" onClick={handleReload} disabled={isReloading}>
                            <IconRefresh className={`mr-2 h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
                            {isReloading ? 'Reloading...' : 'Reload'}
                        </Button>
                    }
                />

                {isLoading && <DashboardSkeleton />}

                {stats && (
                    <div className="mt-6 space-y-6">
                        {/* Top-level stat cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Subscriptions"
                                value={stats.subscriptions?.total ?? 0}
                                description={`${stats.subscriptions?.active ?? 0} active`}
                                icon={IconCreditCard}
                            />
                            <StatCard
                                title="Monthly Recurring Revenue"
                                value={formatCurrency(stats.revenue?.mrr ?? null, stats.revenue?.currency ?? 'EUR')}
                                description="MRR"
                                icon={IconCurrencyEuro}
                            />
                            <StatCard title="Total Customers" value={stats.customers?.total ?? 0} icon={IconUsers} />
                            <StatCard
                                title="Churn This Month"
                                value={stats.churn?.canceledThisMonth ?? 0}
                                description={`${stats.churn?.cancelPendingCount ?? 0} cancel pending`}
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
                                <span>Last updated: {formatDate(stats.lastUpdatedAt)}</span>
                            </div>
                        )}
                    </div>
                )}
            </LayoutContent>
        </div>
    );
}

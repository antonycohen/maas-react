import { useOutletContext } from 'react-router-dom';
import { useGetSubscriptions, useGetInvoices, useGetCustomerQuotas } from '@maas/core-api';
import { Invoice, Subscription } from '@maas/core-api-models';
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Progress,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@maas/web-components';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerInvoiceListSection } from './components/customer-invoice-list-section';

const SUBSCRIPTION_STATUS_STYLES: Record<string, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    trialing: 'border-blue-200 bg-blue-50 text-blue-700',
    past_due: 'border-orange-200 bg-orange-50 text-orange-700',
    canceled: 'border-red-200 bg-red-50 text-red-700',
    unpaid: 'border-red-200 bg-red-50 text-red-700',
    incomplete: 'border-gray-200 bg-gray-50 text-gray-700',
    incomplete_expired: 'border-gray-200 bg-gray-50 text-gray-700',
    paused: 'border-yellow-200 bg-yellow-50 text-yellow-700',
};

const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
    active: 'Active',
    trialing: 'Trialing',
    past_due: 'Past Due',
    canceled: 'Canceled',
    unpaid: 'Unpaid',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    paused: 'Paused',
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatFeatureKey = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const CustomerSubscriptionsTab = () => {
    const { customerId } = useOutletContext<EditCustomerOutletContext>();

    const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useGetSubscriptions({
        filters: { customerId },
        fields: {
            id: null,
            status: null,
            plan: { fields: { id: null, name: null } },
            currency: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: null,
        },
        offset: 0,
        limit: 100,
    });

    const { data: invoicesData, isLoading: isLoadingInvoices } = useGetInvoices({
        filters: { customerId },
        fields: {
            id: null,
            number: null,
            status: null,
            amountDue: null,
            currency: null,
            createdAt: null,
        },
        offset: 0,
        limit: 100,
    });

    const { data: quotas, isLoading: isLoadingQuotas } = useGetCustomerQuotas(customerId);

    const subscriptions = subscriptionsData?.data ?? [];
    // The admin invoices API returns { invoices: [...] } not a flat array
    const invoices = (invoicesData?.data as unknown as { invoices?: Invoice[] })?.invoices ?? [];

    return (
        <LayoutContent>
            <div className="flex flex-col gap-6">
                {/* Subscriptions */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Subscriptions</CardTitle>
                        <CardDescription>Customer subscription plans.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSubscriptions ? (
                            <Skeleton className="h-[100px] w-full rounded-xl" />
                        ) : subscriptions.length === 0 ? (
                            <p className="text-sm text-gray-500">No subscriptions found.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Period Start</TableHead>
                                        <TableHead>Period End</TableHead>
                                        <TableHead>Currency</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptions.map((subscription: Subscription) => {
                                        const status = subscription.status ?? 'incomplete';
                                        const statusStyle =
                                            SUBSCRIPTION_STATUS_STYLES[status] ?? SUBSCRIPTION_STATUS_STYLES.incomplete;
                                        const statusLabel = SUBSCRIPTION_STATUS_LABELS[status] ?? status;

                                        return (
                                            <TableRow key={subscription.id}>
                                                <TableCell className="text-sm font-medium">
                                                    {subscription.plan?.name ?? '\u2014'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-md px-2 py-0.5 text-xs ${statusStyle}`}
                                                    >
                                                        {statusLabel}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDate(subscription.currentPeriodStart)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDate(subscription.currentPeriodEnd)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {subscription.currency?.toUpperCase() ?? '\u2014'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Invoices */}
                <CustomerInvoiceListSection invoices={invoices} isLoading={isLoadingInvoices} />

                {/* Quotas */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Quotas</CardTitle>
                        <CardDescription>Customer usage quotas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingQuotas ? (
                            <Skeleton className="h-[100px] w-full rounded-xl" />
                        ) : !quotas || quotas.length === 0 ? (
                            <p className="text-sm text-gray-500">No quotas available.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {quotas
                                    .filter((q) => q.status === 'active')
                                    .map((quota) => {
                                        const limit = quota.quotaLimit ?? 0;
                                        const used = quota.currentUsage ?? 0;
                                        const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
                                        return (
                                            <div key={quota.id} className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {quota.featureKey
                                                            ? formatFeatureKey(quota.featureKey)
                                                            : quota.id}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {used} / {limit}
                                                    </span>
                                                </div>
                                                <Progress value={percentage} />
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </LayoutContent>
    );
};

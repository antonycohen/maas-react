import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { useGetSubscriptions, useGetInvoices, useGetCustomerQuotas } from '@maas/core-api';
import { Invoice, Quota, Subscription } from '@maas/core-api-models';
import {
    Badge,
    Button,
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
import { IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerInvoiceListSection } from './components/customer-invoice-list-section';
import { CreateSubscriptionDialog } from './components/create-subscription-dialog';
import { ViewSubscriptionDialog } from './components/view-subscription-dialog';
import { UpdateQuotaDialog } from './components/update-quota-dialog';
import { useTranslation } from '@maas/core-translations';

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

const SUBSCRIPTION_STATUS_KEYS: Record<string, string> = {
    active: 'customers.subscriptions.statusActive',
    trialing: 'customers.subscriptions.statusTrialing',
    past_due: 'customers.subscriptions.statusPastDue',
    canceled: 'customers.subscriptions.statusCanceled',
    unpaid: 'customers.subscriptions.statusUnpaid',
    incomplete: 'customers.subscriptions.statusIncomplete',
    incomplete_expired: 'customers.subscriptions.statusExpired',
    paused: 'customers.subscriptions.statusPaused',
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
    const { t } = useTranslation();
    const [showCreateSubscription, setShowCreateSubscription] = useState(false);
    const [viewingSubscriptionId, setViewingSubscriptionId] = useState<string | null>(null);
    const [editingQuota, setEditingQuota] = useState<Quota | null>(null);

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
            metadata: null,
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
            subscriptionId: null,
            metadata: null,
            createdAt: null,
        },
        offset: 0,
        limit: 100,
    });

    const { data: quotas, isLoading: isLoadingQuotas } = useGetCustomerQuotas(customerId);

    const subscriptions = subscriptionsData?.data ?? [];
    const activeSubscription = subscriptions.find((s) => s.status === 'active' || s.status === 'trialing');
    const hasActiveSubscription = !!activeSubscription;
    const manualSubscriptionIds = new Set(
        subscriptions.filter((s) => (s.metadata as Record<string, unknown> | null)?.manual === 'true').map((s) => s.id)
    );
    const canceledSubscriptionIds = new Set(subscriptions.filter((s) => s.status === 'canceled').map((s) => s.id));
    // The admin invoices API returns { invoices: [...] } not a flat array
    const invoices = (invoicesData?.data as unknown as { invoices?: Invoice[] })?.invoices ?? [];

    return (
        <LayoutContent>
            <div className="flex flex-col gap-6">
                {/* Subscriptions */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1.5">
                                <CardTitle className="text-xl">{t('customers.subscriptions.title')}</CardTitle>
                                <CardDescription>{t('customers.subscriptions.description')}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                {!hasActiveSubscription && !isLoadingSubscriptions && (
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => setShowCreateSubscription(true)}
                                    >
                                        <IconPlus className="mr-1 h-4 w-4" />
                                        {t('customers.subscriptions.createSubscription')}
                                    </Button>
                                )}
                                {activeSubscription && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewingSubscriptionId(activeSubscription.id)}
                                    >
                                        {t('customers.subscriptions.editSubscriptions')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingSubscriptions ? (
                            <Skeleton className="h-[100px] w-full rounded-xl" />
                        ) : subscriptions.length === 0 ? (
                            <p className="text-sm text-gray-500">{t('customers.subscriptions.noSubscriptions')}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('customers.subscriptions.plan')}</TableHead>
                                        <TableHead>{t('field.status')}</TableHead>
                                        <TableHead>{t('customers.subscriptions.periodStart')}</TableHead>
                                        <TableHead>{t('customers.subscriptions.periodEnd')}</TableHead>
                                        <TableHead>{t('customers.info.currency')}</TableHead>
                                        <TableHead className="text-right">{t('field.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptions.map((subscription: Subscription) => {
                                        const status = subscription.status ?? 'incomplete';
                                        const statusStyle =
                                            SUBSCRIPTION_STATUS_STYLES[status] ?? SUBSCRIPTION_STATUS_STYLES.incomplete;
                                        const statusKey = SUBSCRIPTION_STATUS_KEYS[status];
                                        const statusLabel = statusKey ? t(statusKey) : status;

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
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title={t('customers.subscriptions.viewSubscription')}
                                                        onClick={() => setViewingSubscriptionId(subscription.id)}
                                                    >
                                                        <IconExternalLink className="h-4 w-4" />
                                                    </Button>
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
                <CustomerInvoiceListSection
                    invoices={invoices}
                    isLoading={isLoadingInvoices}
                    manualSubscriptionIds={manualSubscriptionIds}
                    canceledSubscriptionIds={canceledSubscriptionIds}
                />

                {/* Quotas */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('customers.quotas.title')}</CardTitle>
                        <CardDescription>{t('customers.quotas.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingQuotas ? (
                            <Skeleton className="h-[100px] w-full rounded-xl" />
                        ) : !quotas || quotas.length === 0 ? (
                            <p className="text-sm text-gray-500">{t('customers.quotas.noQuotas')}</p>
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
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            {used} / {limit}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="text-muted-foreground hover:text-foreground"
                                                            onClick={() => setEditingQuota(quota)}
                                                            title={t('customers.quotas.updateUsage')}
                                                        >
                                                            <IconEdit className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
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

            {/* Dialogs */}
            <CreateSubscriptionDialog
                open={showCreateSubscription}
                onOpenChange={setShowCreateSubscription}
                customerId={customerId}
            />

            {viewingSubscriptionId && (
                <ViewSubscriptionDialog
                    open={viewingSubscriptionId !== null}
                    onOpenChange={(open) => {
                        if (!open) setViewingSubscriptionId(null);
                    }}
                    subscriptionId={viewingSubscriptionId}
                />
            )}

            {editingQuota && (
                <UpdateQuotaDialog
                    open={editingQuota !== null}
                    onOpenChange={(open) => {
                        if (!open) setEditingQuota(null);
                    }}
                    customerId={customerId}
                    quota={editingQuota}
                />
            )}
        </LayoutContent>
    );
};

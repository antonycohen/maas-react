import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { useGetSubscriptions, useGetInvoices, useGetCustomerQuotas, useRenewSubscription } from '@maas/core-api';
import { Quota, Subscription } from '@maas/core-api-models';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    Progress,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@maas/web-components';
import { IconEdit, IconExternalLink, IconPlus, IconRefresh, IconSwitchHorizontal } from '@tabler/icons-react';
import { toast } from 'sonner';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerInvoiceListSection } from './components/customer-invoice-list-section';
import { CreateSubscriptionDialog } from './components/create-subscription-dialog';
import { ViewSubscriptionDialog } from './components/view-subscription-dialog';
import { UpdateQuotaDialog } from './components/update-quota-dialog';
import { QuotaTransactionsSection } from './components/quota-transactions-section';
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

type PaymentMethod = 'card' | 'cheque' | 'virement' | 'prelevement' | 'bon';

const PAYMENT_METHODS: PaymentMethod[] = ['card', 'cheque', 'virement', 'prelevement', 'bon'];

const PAYMENT_METHOD_TRANSLATION_KEYS: Record<PaymentMethod, string> = {
    card: 'customers.subscriptions.paymentMethodCard',
    cheque: 'customers.subscriptions.paymentMethodCheque',
    virement: 'customers.subscriptions.paymentMethodVirement',
    prelevement: 'customers.subscriptions.paymentMethodPrelevement',
    bon: 'customers.subscriptions.paymentMethodBon',
};

export const CustomerSubscriptionsTab = () => {
    const { customerId } = useOutletContext<EditCustomerOutletContext>();
    const { t } = useTranslation();
    const [showCreateSubscription, setShowCreateSubscription] = useState(false);
    const [showChangeSubscription, setShowChangeSubscription] = useState(false);
    const [viewingSubscriptionId, setViewingSubscriptionId] = useState<string | null>(null);
    const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
    const [showRenewConfirm, setShowRenewConfirm] = useState(false);
    const [renewPaymentMethod, setRenewPaymentMethod] = useState<PaymentMethod>('card');

    const { mutate: renewSubscription, isPending: isRenewing } = useRenewSubscription({
        onSuccess: () => {
            toast.success(t('customers.subscriptions.subscriptionRenewed'));
            setShowRenewConfirm(false);
            setRenewPaymentMethod('card');
        },
        onError: () => {
            toast.error(t('customers.subscriptions.renewError'));
            setShowRenewConfirm(false);
        },
    });

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
            hostedInvoiceUrl: null,
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
    const invoices = invoicesData?.data ?? [];

    return (
        <LayoutContent>
            <Tabs defaultValue="subscription" className="flex flex-col gap-6">
                <TabsList>
                    <TabsTrigger value="subscription">{t('customers.tabs.subscription')}</TabsTrigger>
                    <TabsTrigger value="billing">{t('customers.tabs.billing')}</TabsTrigger>
                    <TabsTrigger value="usage">{t('customers.tabs.usage')}</TabsTrigger>
                </TabsList>

                {/* Subscription Tab */}
                <TabsContent value="subscription">
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
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isRenewing}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowRenewConfirm(true);
                                                }}
                                            >
                                                <IconRefresh className="mr-1 h-4 w-4" />
                                                {t('customers.subscriptions.renewSubscription')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowChangeSubscription(true)}
                                            >
                                                <IconSwitchHorizontal className="mr-1 h-4 w-4" />
                                                {t('customers.subscriptions.changeSubscription')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setViewingSubscriptionId(activeSubscription.id)}
                                            >
                                                {t('customers.subscriptions.editSubscriptions')}
                                            </Button>
                                        </>
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
                                                SUBSCRIPTION_STATUS_STYLES[status] ??
                                                SUBSCRIPTION_STATUS_STYLES.incomplete;
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                setViewingSubscriptionId(subscription.id);
                                                            }}
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
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                    <CustomerInvoiceListSection
                        invoices={invoices}
                        isLoading={isLoadingInvoices}
                        manualSubscriptionIds={manualSubscriptionIds}
                        canceledSubscriptionIds={canceledSubscriptionIds}
                    />
                </TabsContent>

                {/* Usage Tab */}
                <TabsContent value="usage">
                    <div className="flex flex-col gap-6">
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
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('customers.quotas.featureKey')}</TableHead>
                                                <TableHead>{t('field.status')}</TableHead>
                                                <TableHead>{t('customers.quotas.periodStart')}</TableHead>
                                                <TableHead>{t('customers.quotas.periodEnd')}</TableHead>
                                                <TableHead className="text-right">{t('field.actions')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {quotas
                                                .filter((q) => q.status === 'active')
                                                .map((quota) => {
                                                    const isLast = quota.aggregationType === 'last';
                                                    const limit = quota.quotaLimit ?? 0;
                                                    const used = quota.currentUsage ?? 0;
                                                    const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
                                                    return (
                                                        <TableRow key={quota.id}>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <span className="text-sm font-medium">
                                                                        {quota.featureKey
                                                                            ? formatFeatureKey(quota.featureKey)
                                                                            : quota.id}
                                                                    </span>
                                                                    {!isLast && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Progress
                                                                                value={percentage}
                                                                                className="h-2 w-24"
                                                                            />
                                                                            <span className="text-xs text-gray-500">
                                                                                {used} / {limit}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {isLast ? (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    >
                                                                        {t('common.yes')}
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-sm text-gray-600">
                                                                        {used} / {limit}
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {formatDate(quota.periodStart)}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {formatDate(quota.periodEnd)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {!isLast && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => setEditingQuota(quota)}
                                                                        title={t('customers.quotas.updateUsage')}
                                                                    >
                                                                        <IconEdit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        <QuotaTransactionsSection customerId={customerId} />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CreateSubscriptionDialog
                open={showCreateSubscription}
                onOpenChange={setShowCreateSubscription}
                customerId={customerId}
            />

            {activeSubscription && (
                <CreateSubscriptionDialog
                    open={showChangeSubscription}
                    onOpenChange={setShowChangeSubscription}
                    customerId={customerId}
                    mode="change"
                    subscriptionId={activeSubscription.id}
                    currentPlanId={activeSubscription.plan?.id ?? null}
                />
            )}

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

            <Dialog
                open={showRenewConfirm}
                onOpenChange={(open) => {
                    if (!open) {
                        setRenewPaymentMethod('card');
                    }
                    setShowRenewConfirm(open);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('customers.subscriptions.renewConfirmTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('customers.subscriptions.renewConfirmDescription', {
                                plan: activeSubscription?.plan?.name ?? '',
                                endDate: formatDate(activeSubscription?.currentPeriodEnd ?? null),
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium">{t('customers.subscriptions.paymentMethod')}</Label>
                        <Select
                            value={renewPaymentMethod}
                            onValueChange={(v) => setRenewPaymentMethod(v as PaymentMethod)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAYMENT_METHODS.map((method) => (
                                    <SelectItem key={method} value={method}>
                                        {t(PAYMENT_METHOD_TRANSLATION_KEYS[method])}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRenewConfirm(false)} disabled={isRenewing}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                if (activeSubscription) {
                                    renewSubscription({
                                        subscriptionId: activeSubscription.id,
                                        paymentMethod: renewPaymentMethod,
                                    });
                                }
                            }}
                            disabled={isRenewing}
                            isLoading={isRenewing}
                        >
                            {t('customers.subscriptions.renewSubscription')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LayoutContent>
    );
};

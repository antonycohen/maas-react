import { useState } from 'react';
import { Subscription } from '@maas/core-api-models';
import { useCancelSubscriptionAtPeriodEnd, useUncancelSubscription } from '@maas/core-api';
import { useRefreshSubscriptionStatus } from '@maas/core-store-session';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    Textarea,
} from '@maas/web-components';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';
import {
    SUBSCRIPTION_STATUS_STYLES,
    SUBSCRIPTION_STATUS_TRANSLATION_KEYS,
} from '../../../../../constants/status-styles';

type Props = {
    subscription: Subscription | undefined;
    onMutationSuccess?: () => void;
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatAmount = (amountInCents: number, currency: string | null): string => {
    const amount = amountInCents / 100;
    const currencyCode = currency?.toUpperCase() ?? 'EUR';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currencyCode }).format(amount);
};

const CANCEL_REASONS = ['too_expensive', 'not_using', 'missing_features', 'switching_provider', 'other'] as const;

type CancelStep = 'reason' | 'confirm';

export const SubscriptionOverviewSection = ({ subscription, onMutationSuccess }: Props) => {
    const { t } = useTranslation();
    const { refresh } = useRefreshSubscriptionStatus();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelStep, setCancelStep] = useState<CancelStep>('reason');
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const cancelMutation = useCancelSubscriptionAtPeriodEnd({
        onSuccess: async () => {
            await refresh();
            onMutationSuccess?.();
            closeCancelDialog();
        },
    });

    const uncancelMutation = useUncancelSubscription({
        onSuccess: async () => {
            await refresh();
            onMutationSuccess?.();
        },
    });

    const closeCancelDialog = () => {
        setCancelDialogOpen(false);
        setCancelStep('reason');
        setSelectedReason('');
        setOtherReason('');
    };

    const handleReasonNext = () => {
        setCancelStep('confirm');
    };

    const handleConfirmCancel = () => {
        if (!subscription) return;
        const reason = selectedReason === 'other' ? otherReason : selectedReason;
        cancelMutation.mutate({
            subscriptionId: subscription.id,
            cancelReason: reason,
        });
    };

    const isReasonValid = selectedReason !== '' && (selectedReason !== 'other' || otherReason.trim() !== '');

    if (!subscription) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{t('account.subscription.title')}</CardTitle>
                    <CardDescription>{t('account.subscription.noSubscription')}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const status = subscription.status ?? 'incomplete';
    const statusStyle = SUBSCRIPTION_STATUS_STYLES[status] ?? SUBSCRIPTION_STATUS_STYLES.incomplete;
    const statusKey = SUBSCRIPTION_STATUS_TRANSLATION_KEYS[status];
    const statusLabel = statusKey ? t(statusKey) : status;
    const isCanceling = subscription.cancelAtPeriodEnd;
    const currenPeriodEnd = subscription.currentPeriodEnd;

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{t('account.subscription.title')}</CardTitle>
                    <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-xs ${statusStyle}`}>
                        {statusLabel}
                    </Badge>
                </div>
                <CardDescription>{t('account.subscription.details')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.plan')}
                        </p>
                        <p className="mt-1 text-sm font-medium">{subscription.plan?.name ?? '\u2014'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.currency')}
                        </p>
                        <p className="mt-1 text-sm font-medium">{subscription.currency?.toUpperCase() ?? '\u2014'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.periodStart')}
                        </p>
                        <p className="mt-1 text-sm font-medium">{formatDate(subscription.currentPeriodStart)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.periodEnd')}
                        </p>
                        <p className="mt-1 text-sm font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                </div>

                {subscription.items && subscription.items.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.items')}
                        </p>
                        <ul className="mt-1 space-y-1">
                            {subscription.items.map((item) => (
                                <li key={item.id} className="text-sm font-medium">
                                    {item.price?.product?.name ?? item.price?.nickname ?? item.id}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {subscription.renewalTotalInCents != null && (
                    <div className="mt-4">
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            {t('account.subscription.renewalTotal')}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {formatAmount(subscription.renewalTotalInCents, subscription.currency)}
                        </p>
                    </div>
                )}

                {isCanceling ? (
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                            <p className="text-sm font-medium text-orange-700">
                                {t('account.subscription.cancellationScheduled', {
                                    date: subscription.cancelAt
                                        ? formatDate(subscription.cancelAt)
                                        : formatDate(currenPeriodEnd),
                                })}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => uncancelMutation.mutate(subscription.id)}
                            disabled={uncancelMutation.isPending}
                        >
                            {t('account.subscription.undoCancellation')}
                        </Button>
                    </div>
                ) : (
                    <Collapsible className="mt-6 border-t pt-4">
                        <CollapsibleTrigger className="flex w-full items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 [&[data-state=open]>svg]:rotate-90">
                            <ChevronRight className="h-4 w-4 transition-transform" />
                            {t('account.subscription.manageSubscription')}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                            <p className="mb-3 text-sm text-gray-500">{t('account.subscription.autoRenewal')}</p>
                            <button
                                className="text-sm text-red-500 underline underline-offset-2 transition-colors hover:text-red-600"
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                {t('account.subscription.cancelButton')}
                            </button>

                            <Dialog
                                open={cancelDialogOpen}
                                onOpenChange={(open) => {
                                    if (!open) closeCancelDialog();
                                }}
                            >
                                <DialogContent>
                                    {cancelStep === 'reason' ? (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>{t('account.subscription.cancelReasonTitle')}</DialogTitle>
                                                <DialogDescription>
                                                    {t('account.subscription.cancelReasonDescription')}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-2 py-4">
                                                {CANCEL_REASONS.map((reason) => (
                                                    <label
                                                        key={reason}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                                            selectedReason === reason
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="cancelReason"
                                                            value={reason}
                                                            checked={selectedReason === reason}
                                                            onChange={(e) => setSelectedReason(e.target.value)}
                                                            className="accent-primary"
                                                        />
                                                        <span className="text-sm">
                                                            {t(`account.subscription.cancelReasons.${reason}`)}
                                                        </span>
                                                    </label>
                                                ))}
                                                {selectedReason === 'other' && (
                                                    <div className="mt-2">
                                                        <Label htmlFor="otherReason">
                                                            {t('account.subscription.cancelReasonOtherLabel')}
                                                        </Label>
                                                        <Textarea
                                                            id="otherReason"
                                                            value={otherReason}
                                                            onChange={(e) => setOtherReason(e.target.value)}
                                                            placeholder={t(
                                                                'account.subscription.cancelReasonOtherPlaceholder'
                                                            )}
                                                            className="mt-1"
                                                            rows={3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={closeCancelDialog}>
                                                    {t('account.subscription.cancelDialogCancel')}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleReasonNext}
                                                    disabled={!isReasonValid}
                                                >
                                                    {t('account.subscription.cancelReasonNext')}
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    ) : (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>{t('account.subscription.cancelDialogTitle')}</DialogTitle>
                                                <DialogDescription>
                                                    {t('account.subscription.cancelDialogDescription')}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setCancelStep('reason')}>
                                                    {t('account.subscription.cancelDialogBack')}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleConfirmCancel}
                                                    disabled={cancelMutation.isPending}
                                                >
                                                    {t('account.subscription.cancelDialogConfirm')}
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </CardContent>
        </Card>
    );
};

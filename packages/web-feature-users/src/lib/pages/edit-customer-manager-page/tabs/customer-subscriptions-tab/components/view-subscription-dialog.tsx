import { useState } from 'react';
import {
    useGetSubscriptionById,
    useCancelSubscriptionAtPeriodEnd,
    useCancelSubscriptionImmediately,
    useSyncSubscription,
} from '@maas/core-api';
import { SubscriptionStatus } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import {
    Badge,
    Button,
    ConfirmActionDialog,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Separator,
    Skeleton,
} from '@maas/web-components';
import { IconRefresh, IconPlayerPause, IconX, IconCopy, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

const getStatusColor = (status: SubscriptionStatus | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'active':
            return 'default';
        case 'trialing':
            return 'outline';
        case 'past_due':
        case 'unpaid':
            return 'destructive';
        case 'canceled':
        case 'incomplete':
        case 'incomplete_expired':
        case 'paused':
        default:
            return 'secondary';
    }
};

function CopyField({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(t('common.copiedToClipboard'));
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-muted/50 flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-sm">{value}</span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                {copied ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
            </Button>
        </div>
    );
}

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscriptionId: string;
};

export const ViewSubscriptionDialog = ({ open, onOpenChange, subscriptionId }: Props) => {
    const { t } = useTranslation();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelAtEndDialogOpen, setCancelAtEndDialogOpen] = useState(false);

    const {
        data: subscription,
        isLoading,
        refetch,
    } = useGetSubscriptionById({
        id: subscriptionId,
        fields: {
            id: null,
            status: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: null,
            customer: {
                fields: {
                    id: null,
                    email: null,
                    refId: null,
                },
            },
            canceledAt: null,
            metadata: null,
            plan: null,
        },
    });

    const cancelAtPeriodEndMutation = useCancelSubscriptionAtPeriodEnd({
        onSuccess: () => {
            toast.success(t('subscriptions.cancelAtPeriodEndSuccess'));
            setCancelAtEndDialogOpen(false);
            refetch();
        },
        onError: () => {
            toast.error(t('subscriptions.cancelError'));
        },
    });

    const cancelImmediatelyMutation = useCancelSubscriptionImmediately({
        onSuccess: () => {
            toast.success(t('subscriptions.cancelNowSuccess'));
            setCancelDialogOpen(false);
            refetch();
        },
        onError: () => {
            toast.error(t('subscriptions.cancelError'));
        },
    });

    const syncMutation = useSyncSubscription({
        onSuccess: () => {
            toast.success(t('subscriptions.syncSuccess'));
            refetch();
        },
        onError: () => {
            toast.error(t('subscriptions.syncError'));
        },
    });

    const isPastDue = subscription?.status === 'past_due';
    const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
    const canCancel = isActive || isPastDue;
    const isCancelingAtPeriodEnd = subscription?.cancelAtPeriodEnd;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{t('customers.subscriptions.editSubscriptions')}</DialogTitle>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-10 w-full rounded-xl" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    ) : !subscription ? (
                        <p className="text-muted-foreground text-sm">{t('subscriptions.notFound')}</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {/* Status & Actions */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                                    {isCancelingAtPeriodEnd && (
                                        <Badge variant="destructive">{t('subscriptions.cancelingAtPeriodEnd')}</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => syncMutation.mutate(subscriptionId)}
                                        disabled={syncMutation.isPending}
                                    >
                                        <IconRefresh
                                            className={cn('mr-1.5 h-4 w-4', syncMutation.isPending && 'animate-spin')}
                                        />
                                        {t('common.sync')}
                                    </Button>
                                    {isActive && !isCancelingAtPeriodEnd && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCancelAtEndDialogOpen(true)}
                                            disabled={cancelAtPeriodEndMutation.isPending}
                                        >
                                            <IconPlayerPause className="mr-1.5 h-4 w-4" />
                                            {t('subscriptions.cancelAtPeriodEnd')}
                                        </Button>
                                    )}
                                    {canCancel && !isCancelingAtPeriodEnd && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setCancelDialogOpen(true)}
                                            disabled={cancelImmediatelyMutation.isPending}
                                        >
                                            <IconX className="mr-1.5 h-4 w-4" />
                                            {t('subscriptions.cancelNow')}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Details */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                                        {t('subscriptions.subscriptionId')}
                                    </p>
                                    <CopyField value={subscription.id} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            {t('subscriptions.plan')}
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {subscription.plan?.name ?? subscription.plan?.id ?? '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            {t('subscriptions.user')}
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {subscription.customer?.name ??
                                                subscription.customer?.email ??
                                                subscription.customer?.id ??
                                                '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            {t('subscriptions.currentPeriodStart')}
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {subscription.currentPeriodStart
                                                ? new Date(subscription.currentPeriodStart).toLocaleString()
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            {t('subscriptions.currentPeriodEnd')}
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {subscription.currentPeriodEnd
                                                ? new Date(subscription.currentPeriodEnd).toLocaleString()
                                                : '-'}
                                        </p>
                                    </div>
                                </div>

                                {subscription.canceledAt && (
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            {t('subscriptions.canceledAt')}
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {new Date(subscription.canceledAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Metadata */}
                            {subscription.metadata && Object.keys(subscription.metadata).length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm font-medium">
                                            {t('subscriptions.metadata')}
                                        </p>
                                        <pre className="bg-muted/50 overflow-auto rounded-lg p-4 text-xs">
                                            {JSON.stringify(subscription.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmActionDialog
                open={cancelAtEndDialogOpen}
                onOpenChange={setCancelAtEndDialogOpen}
                onConfirm={() => cancelAtPeriodEndMutation.mutate(subscriptionId)}
                title={t('subscriptions.cancelAtPeriodEndConfirm')}
                description={t('subscriptions.cancelAtPeriodEndDescription')}
                confirmLabel={t('subscriptions.cancelAtPeriodEnd')}
                isLoading={cancelAtPeriodEndMutation.isPending}
            />

            <ConfirmActionDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                onConfirm={() => cancelImmediatelyMutation.mutate(subscriptionId)}
                title={t('subscriptions.cancelNowConfirm')}
                description={t('subscriptions.cancelNowDescription')}
                confirmLabel={t('subscriptions.cancelNow')}
                isLoading={cancelImmediatelyMutation.isPending}
            />
        </>
    );
};

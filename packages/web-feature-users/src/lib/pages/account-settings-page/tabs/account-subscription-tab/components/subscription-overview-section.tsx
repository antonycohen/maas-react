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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@maas/web-components';
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

export const SubscriptionOverviewSection = ({ subscription, onMutationSuccess }: Props) => {
    const { t } = useTranslation();
    const { refresh } = useRefreshSubscriptionStatus();

    const cancelMutation = useCancelSubscriptionAtPeriodEnd({
        onSuccess: async () => {
            await refresh();
            onMutationSuccess?.();
        },
    });

    const uncancelMutation = useUncancelSubscription({
        onSuccess: async () => {
            await refresh();
            onMutationSuccess?.();
        },
    });

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
    console.log(subscription, formatDate(subscription.cancelAt));
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

                {isCanceling ? (
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                            <p className="text-sm font-medium text-orange-700">
                                {t('account.subscription.cancellationScheduled', {
                                    date: formatDate(subscription.cancelAt),
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
                    <div className="mt-4 flex flex-col gap-3">
                        <p className="text-sm text-gray-500">{t('account.subscription.autoRenewal')}</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="text-red-600 hover:text-red-700">
                                    {t('account.subscription.cancelButton')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('account.subscription.cancelDialogTitle')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('account.subscription.cancelDialogDescription')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {t('account.subscription.cancelDialogCancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => cancelMutation.mutate(subscription.id)}
                                        disabled={cancelMutation.isPending}
                                    >
                                        {t('account.subscription.cancelDialogConfirm')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

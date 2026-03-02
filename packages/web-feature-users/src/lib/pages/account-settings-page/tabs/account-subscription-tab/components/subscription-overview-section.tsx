import { Subscription } from '@maas/core-api-models';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import {
    SUBSCRIPTION_STATUS_STYLES,
    SUBSCRIPTION_STATUS_TRANSLATION_KEYS,
} from '../../../../../constants/status-styles';

type Props = {
    subscription: Subscription | undefined;
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const SubscriptionOverviewSection = ({ subscription }: Props) => {
    const { t } = useTranslation();
    if (!subscription) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Abonnement</CardTitle>
                    <CardDescription>Aucun abonnement actif.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const status = subscription.status ?? 'incomplete';
    const statusStyle = SUBSCRIPTION_STATUS_STYLES[status] ?? SUBSCRIPTION_STATUS_STYLES.incomplete;
    const statusKey = SUBSCRIPTION_STATUS_TRANSLATION_KEYS[status];
    const statusLabel = statusKey ? t(statusKey) : status;

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Abonnement</CardTitle>
                    <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-xs ${statusStyle}`}>
                        {statusLabel}
                    </Badge>
                </div>
                <CardDescription>Détails de votre abonnement actuel.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Plan</p>
                        <p className="mt-1 text-sm font-medium">{subscription.plan?.name ?? '\u2014'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Devise</p>
                        <p className="mt-1 text-sm font-medium">{subscription.currency?.toUpperCase() ?? '\u2014'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Début de période</p>
                        <p className="mt-1 text-sm font-medium">{formatDate(subscription.currentPeriodStart)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Fin de période</p>
                        <p className="mt-1 text-sm font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                </div>
                {subscription.cancelAtPeriodEnd && (
                    <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <p className="text-sm text-orange-700">
                            Votre abonnement sera annulé à la fin de la période en cours.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

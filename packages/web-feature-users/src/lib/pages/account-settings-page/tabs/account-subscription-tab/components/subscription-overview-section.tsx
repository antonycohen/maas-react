import { Subscription } from '@maas/core-api-models';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maas/web-components';

type Props = {
    subscription: Subscription | undefined;
};

const STATUS_STYLES: Record<string, string> = {
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    trialing: 'border-blue-200 bg-blue-50 text-blue-700',
    past_due: 'border-orange-200 bg-orange-50 text-orange-700',
    canceled: 'border-red-200 bg-red-50 text-red-700',
    unpaid: 'border-red-200 bg-red-50 text-red-700',
    incomplete: 'border-gray-200 bg-gray-50 text-gray-700',
    incomplete_expired: 'border-gray-200 bg-gray-50 text-gray-700',
    paused: 'border-yellow-200 bg-yellow-50 text-yellow-700',
};

const STATUS_LABELS: Record<string, string> = {
    active: 'Actif',
    trialing: 'Essai',
    past_due: 'En retard',
    canceled: 'Annulé',
    unpaid: 'Impayé',
    incomplete: 'Incomplet',
    incomplete_expired: 'Expiré',
    paused: 'En pause',
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
    const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.incomplete;
    const statusLabel = STATUS_LABELS[status] ?? status;

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

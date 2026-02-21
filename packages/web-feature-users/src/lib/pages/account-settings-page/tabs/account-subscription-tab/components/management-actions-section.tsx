import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maas/web-components';
import { ArrowUpCircle, CreditCard } from 'lucide-react';
import { useCreateSubscriptionUpdateSession, useCreatePaymentMethodUpdateSession } from '@maas/core-api';
import { toast } from 'sonner';

export const ManagementActionsSection = () => {
    const [isRedirecting, setIsRedirecting] = useState<'subscription' | 'payment' | null>(null);

    const returnUrl = window.location.href;

    const subscriptionUpdateMutation = useCreateSubscriptionUpdateSession({
        onSuccess: (data) => {
            window.location.href = data.portalSession.portalUrl;
        },
        onError: () => {
            setIsRedirecting(null);
            toast.error('Impossible de créer la session. Veuillez réessayer.');
        },
    });

    const paymentMethodUpdateMutation = useCreatePaymentMethodUpdateSession({
        onSuccess: (data) => {
            window.location.href = data.portalSession.url;
        },
        onError: () => {
            setIsRedirecting(null);
            toast.error('Impossible de créer la session. Veuillez réessayer.');
        },
    });

    const handleSubscriptionUpdate = () => {
        setIsRedirecting('subscription');
        subscriptionUpdateMutation.mutate({ returnUrl });
    };

    const handlePaymentMethodUpdate = () => {
        setIsRedirecting('payment');
        paymentMethodUpdateMutation.mutate({ returnUrl });
    };

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Gérer mon abonnement</CardTitle>
                <CardDescription>Modifiez votre plan ou mettez à jour votre moyen de paiement.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleSubscriptionUpdate}
                        isLoading={isRedirecting === 'subscription'}
                        disabled={isRedirecting !== null}
                        className="w-full justify-center gap-2"
                    >
                        <ArrowUpCircle className="h-4 w-4" />
                        Changer de plan
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handlePaymentMethodUpdate}
                        isLoading={isRedirecting === 'payment'}
                        disabled={isRedirecting !== null}
                        className="w-full justify-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        Modifier le moyen de paiement
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

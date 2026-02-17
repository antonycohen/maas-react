import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maas/web-components';
import { CreditCard } from 'lucide-react';
import { useCreatePaymentMethodUpdateSession } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { toast } from 'sonner';

export const PaymentMethodSection = () => {
    const { t } = useTranslation();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const returnUrl = window.location.href;

    const paymentMethodUpdateMutation = useCreatePaymentMethodUpdateSession({
        onSuccess: (data) => {
            window.location.href = data.portalSession.url;
        },
        onError: () => {
            setIsRedirecting(false);
            toast.error(t('planChange.errorToast'));
        },
    });

    const handlePaymentMethodUpdate = () => {
        setIsRedirecting(true);
        paymentMethodUpdateMutation.mutate({ returnUrl });
    };

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Moyen de paiement</CardTitle>
                <CardDescription>Modifiez votre carte bancaire ou moyen de paiement.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    onClick={handlePaymentMethodUpdate}
                    isLoading={isRedirecting}
                    disabled={isRedirecting}
                    className="gap-2"
                >
                    <CreditCard className="h-4 w-4" />
                    Modifier le moyen de paiement
                </Button>
            </CardContent>
        </Card>
    );
};

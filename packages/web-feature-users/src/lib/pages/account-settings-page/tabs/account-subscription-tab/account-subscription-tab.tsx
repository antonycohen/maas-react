import { useGetMySubscription, useGetMyQuotas, useGetMyInvoices, useGetInvoicePaymentUrl } from '@maas/core-api';
import { Alert, AlertDescription, Button, Skeleton } from '@maas/web-components';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { SubscriptionOverviewSection } from './components/subscription-overview-section';
import { QuotaUsageSection } from './components/quota-usage-section';
import { PaymentMethodSection } from './components/payment-method-section';

export const AccountSubscriptionTab = () => {
    const {
        data: subscription,
        isLoading: isLoadingSubscription,
        refetch: refetchSubscription,
    } = useGetMySubscription({
        id: null,
        status: null,
        plan: {
            fields: {
                id: null,
                name: null,
            },
        },
        currency: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: null,
        cancelAt: null,
        canceledAt: null,
        startDate: null,
        renewalTotalInCents: null,
        items: null,
    });
    const { data: quotas, isLoading: isLoadingQuotas } = useGetMyQuotas();

    const isPastDue = subscription?.status === 'past_due';

    const { data: invoicesData } = useGetMyInvoices({ status: 'open' }, { enabled: isPastDue });

    const { mutate: pay, isPending: isPaying } = useGetInvoicePaymentUrl({
        onSuccess: (data) => {
            if (data.paymentUrl) {
                window.location.assign(data.paymentUrl);
            }
        },
        onError: () => {
            toast.error('Impossible de récupérer le lien de paiement.');
        },
    });

    const latestOpenInvoice = invoicesData?.invoices?.[0];

    if (isLoadingSubscription || isLoadingQuotas) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-50 w-full rounded-2xl" />
                <Skeleton className="h-50 w-full rounded-2xl" />
                <Skeleton className="h-75 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {isPastDue && latestOpenInvoice && (
                <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 self-center" />
                    <AlertDescription className="flex items-center justify-between">
                        <span className="text-sm font-medium">Le paiement de votre dernière facture a échoué.</span>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isPaying}
                            onClick={() => pay(latestOpenInvoice.id)}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Payer la facture
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            <SubscriptionOverviewSection subscription={subscription} onMutationSuccess={() => refetchSubscription()} />
            {quotas && <QuotaUsageSection quotas={quotas} />}
            {subscription && <PaymentMethodSection />}
        </div>
    );
};

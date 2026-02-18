import { useGetMySubscription, useGetMyQuotas } from '@maas/core-api';
import { Skeleton } from '@maas/web-components';
import { SubscriptionOverviewSection } from './components/subscription-overview-section';
import { QuotaUsageSection } from './components/quota-usage-section';
import { PaymentMethodSection } from './components/payment-method-section';

export const AccountSubscriptionTab = () => {
    const { data: subscription, isLoading: isLoadingSubscription } = useGetMySubscription({
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
        canceledAt: null,
        startDate: null,
        items: null,
    });
    const { data: quotas, isLoading: isLoadingQuotas } = useGetMyQuotas();

    if (isLoadingSubscription || isLoadingQuotas) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[300px] w-full rounded-2xl" />
                <Skeleton className="h-[80px] w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <SubscriptionOverviewSection subscription={subscription} />
            <QuotaUsageSection quotas={quotas} />
            <PaymentMethodSection />
        </div>
    );
};

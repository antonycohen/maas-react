import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOAuthStore, useOAuthHydrated } from '@maas/core-store-oauth';
import { usePublicRoutes } from '@maas/core-routes';
import { usePricingData } from '../../hooks/use-pricing-data';
import { usePricingStore } from '../../store/pricing-store';
import { usePrefillCustomerAddress } from '../../hooks/use-prefill-customer-address';
import { PricingPaiementStep } from '../../components/pricing-paiement-step';
import { PricingStepperLayout } from '../../components/pricing-stepper-layout';

export const PricingPaiementPage = () => {
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const selectedPlanId = usePricingStore((s) => s.selectedPlanId);
    const accessToken = useOAuthStore((s) => s.accessToken);
    const isHydrated = useOAuthHydrated();
    const { pricingPlans, isLoading } = usePricingData();
    const { isLoading: isPrefilling } = usePrefillCustomerAddress();

    const selectedPlan = useMemo(
        () => pricingPlans.find((p) => p.planId === selectedPlanId) ?? null,
        [pricingPlans, selectedPlanId]
    );

    useEffect(() => {
        if (!isLoading && !selectedPlanId) {
            navigate(publicRoutes.pricing);
        }
    }, [isLoading, selectedPlanId, navigate, publicRoutes.pricing]);

    useEffect(() => {
        if (isHydrated && !accessToken) {
            navigate(publicRoutes.pricingAuth);
        }
    }, [isHydrated, accessToken, navigate, publicRoutes.pricingAuth]);

    if (!isHydrated || isLoading || !selectedPlan || !accessToken) {
        return null;
    }

    return (
        <PricingStepperLayout currentStepName="paiement">
            <div className="flex w-full flex-col items-center">
                <div className="w-full max-w-5xl">
                    <PricingPaiementStep plan={selectedPlan} isPrefilling={isPrefilling} />
                </div>
            </div>
        </PricingStepperLayout>
    );
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOAuthStore } from '@maas/core-store-oauth';
import { usePublicRoutes } from '@maas/core-routes';
import { usePricingStore } from '../../store/pricing-store';
import { PricingAuthStep } from '../../components/pricing-auth-step';
import { PricingStepperLayout } from '../../components/pricing-stepper-layout';

export const PricingAuthPage = () => {
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const selectedPlanId = usePricingStore((s) => s.selectedPlanId);
    const accessToken = useOAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (!selectedPlanId) {
            navigate(publicRoutes.pricing);
        }
    }, [selectedPlanId, navigate]);

    // If already logged in, skip to paiement
    useEffect(() => {
        if (accessToken) {
            navigate(publicRoutes.pricingPaiement, { replace: true });
        }
    }, [accessToken, navigate]);

    if (!selectedPlanId || accessToken) {
        return null;
    }

    return (
        <PricingStepperLayout currentStepName="auth">
            <div className="flex w-full flex-col items-center">
                <div className="w-full max-w-2xl">
                    <PricingAuthStep />
                </div>
            </div>
        </PricingStepperLayout>
    );
};

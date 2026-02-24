import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOAuthStore, useOAuthHydrated } from '@maas/core-store-oauth';
import { usePublicRoutes } from '@maas/core-routes';
import { usePrefillCustomerAddress } from '../../hooks/use-prefill-customer-address';
import { PricingAdresseStep } from '../../components/pricing-adresse-step';
import { PricingStepperLayout } from '../../components/pricing-stepper-layout';

export const PricingAdressePage = () => {
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const accessToken = useOAuthStore((s) => s.accessToken);
    const isHydrated = useOAuthHydrated();
    usePrefillCustomerAddress();

    useEffect(() => {
        if (isHydrated && !accessToken) {
            navigate(publicRoutes.pricingAuth);
        }
    }, [isHydrated, accessToken, navigate]);

    if (!isHydrated || !accessToken) {
        return null;
    }

    return (
        <PricingStepperLayout currentStepName="adresse">
            <div className="flex w-full flex-col items-center">
                <div className="w-full max-w-2xl">
                    <PricingAdresseStep />
                </div>
            </div>
        </PricingStepperLayout>
    );
};

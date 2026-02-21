import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOAuthStore } from '@maas/core-store-oauth';
import { usePublicRoutes } from '@maas/core-routes';
import { usePrefillCustomerAddress } from '../../hooks/use-prefill-customer-address';
import { PricingAdresseStep } from '../../components/pricing-adresse-step';
import { PricingStepperLayout } from '../../components/pricing-stepper-layout';

export const PricingAdressePage = () => {
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const accessToken = useOAuthStore((s) => s.accessToken);
    usePrefillCustomerAddress();

    useEffect(() => {
        if (!accessToken) {
            navigate(publicRoutes.pricingAuth);
        }
    }, [accessToken, navigate]);

    if (!accessToken) {
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

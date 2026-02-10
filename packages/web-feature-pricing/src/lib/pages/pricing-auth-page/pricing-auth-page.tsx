import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePricingData } from '../../hooks/use-pricing-data';
import { usePricingStore } from '../../store/pricing-store';
import { PricingAuthStep } from '../../components/pricing-auth-step';
import { PricingSummary } from '../../components/pricing-summary';

export const PricingAuthPage = () => {
    const navigate = useNavigate();
    const selectedPlanId = usePricingStore((s) => s.selectedPlanId);
    const { pricingPlans, isLoading } = usePricingData();

    const selectedPlan = useMemo(
        () => pricingPlans.find((p) => p.planId === selectedPlanId) ?? null,
        [pricingPlans, selectedPlanId]
    );

    useEffect(() => {
        if (!isLoading && !selectedPlanId) {
            navigate('/pricing');
        }
    }, [isLoading, selectedPlanId, navigate]);

    if (isLoading || !selectedPlan) {
        return null;
    }

    return (
        <div className="container mx-auto flex w-full flex-col items-center px-5 py-40 xl:px-0">
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
                <div className="flex-1">
                    <PricingAuthStep />
                </div>
                <PricingSummary plan={selectedPlan} />
            </div>
        </div>
    );
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@maas/core-utils';
import { useCreateCheckoutSession, AuthenticationError, type CheckoutSession } from '@maas/core-api';
import { usePublicRoutes } from '@maas/core-routes';
import type { PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { PricingSummary } from './pricing-summary';

const SHIPPING_METRO = 'metro';

interface PricingPaiementStepProps {
    plan: PricingPlan;
}

export function PricingPaiementStep({ plan }: PricingPaiementStepProps) {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const checkoutMutation = useCreateCheckoutSession();

    const selectedPriceIds = useMemo(() => {
        const priceIds: string[] = [];
        const basePrice = plan.prices.find((p) => p.interval === selectedInterval);
        if (basePrice?.priceId) {
            priceIds.push(basePrice.priceId);
        }
        for (const addon of plan.addons) {
            if (addon.category === 'addon' && addonToggles[addon.productId]) {
                const price = addon.prices.find((p) => p.interval === selectedInterval);
                if (price?.priceId) priceIds.push(price.priceId);
            }
            if (addon.category === 'shipping') {
                const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
                if (shippingValue !== SHIPPING_METRO) {
                    const price = addon.prices.find((p) => p.interval === selectedInterval);
                    if (price?.priceId) priceIds.push(price.priceId);
                }
            }
        }
        return priceIds;
    }, [plan, selectedInterval, addonToggles, shippingSelections]);

    const handlePay = () => {
        const origin = window.location.origin;

        checkoutMutation.mutate(
            {
                priceIds: selectedPriceIds,
                successUrl: `${origin}${publicRoutes.pricingAdresse}`,
                cancelUrl: `${origin}${publicRoutes.checkoutCancel}`,
            },
            {
                onSuccess: (data: CheckoutSession) => {
                    window.location.href = data.checkoutSession.checkoutUrl;
                },
                onError: (error) => {
                    if (error instanceof AuthenticationError) {
                        localStorage.setItem('target-url', publicRoutes.pricingPaiement);
                        navigate(publicRoutes.pricingAuth);
                    }
                },
            }
        );
    };

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                            Récapitulatif de votre commande
                        </p>
                        <h3 className="font-heading text-foreground text-xl font-semibold">{planName}</h3>
                    </div>
                    <button
                        onClick={() => navigate(publicRoutes.pricing)}
                        className="text-text-secondary hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                    >
                        Retour
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    <PricingSummary plan={plan} hideCheckedAddonToggles />

                    {checkoutMutation.isError && (
                        <p className="text-destructive text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                    )}

                    <button
                        onClick={handlePay}
                        disabled={checkoutMutation.isPending || selectedPriceIds.length === 0}
                        className={cn(
                            'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                            checkoutMutation.isPending && 'cursor-wait opacity-70'
                        )}
                    >
                        {checkoutMutation.isPending ? 'Redirection...' : 'Confirmer et payer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

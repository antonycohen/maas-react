import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { IconMapPin, IconWorld } from '@tabler/icons-react';
import { useOAuthStore } from '@maas/core-store-oauth';
import type { BillingInterval, PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { PricingSummary } from './pricing-summary';

const SHIPPING_METRO = 'metro';

const INTERVAL_DISPLAY_NAMES: Record<BillingInterval, string> = {
    monthly: '1 mois',
    semester: '6 mois',
    annual: '1 an',
    biennial: '2 ans',
};

const INTERVAL_MONTHS: Record<BillingInterval, number> = {
    monthly: 1,
    semester: 6,
    annual: 12,
    biennial: 24,
};

function formatCentsToEurosString(cents: number): string {
    const euros = cents / 100;
    return euros % 1 === 0 ? `${euros}€` : `${euros.toFixed(2)}€`;
}

interface PricingConfiguratorProps {
    plan: PricingPlan;
}

export function PricingConfigurator({ plan }: PricingConfiguratorProps) {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const setSelectedInterval = usePricingStore((s) => s.setSelectedInterval);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const setShipping = usePricingStore((s) => s.setShipping);
    const accessToken = useOAuthStore((s) => s.accessToken);
    const navigate = useNavigate();

    // Auto-select interval when plan changes or if current interval isn't available
    useEffect(() => {
        if (!selectedInterval || !plan.prices.find((p) => p.interval === selectedInterval)) {
            const defaultInterval =
                plan.prices.find((p) => p.interval === 'annual')?.interval ?? plan.prices[0]?.interval;
            if (defaultInterval) {
                setSelectedInterval(defaultInterval);
            }
        }
    }, [plan.planId, plan.prices, selectedInterval, setSelectedInterval]);

    const isDigitalPlan = plan.addons.length === 0;

    const shippingAddon = plan.addons.find((a) => a.category === 'shipping');
    const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
    const isInternational = shippingAddon ? shippingValue === shippingAddon.productId : false;

    const handleSubscribe = () => {
        if (accessToken) {
            navigate('/pricing/paiement');
        } else {
            navigate('/pricing/auth');
        }
    };

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    // Savings calculation: compare selected interval vs monthly equivalent
    const savingsText = useMemo(() => {
        if (!selectedInterval || selectedInterval === 'monthly') return null;
        const monthlyPrice = plan.prices.find((p) => p.interval === 'monthly');
        const selectedPrice = plan.prices.find((p) => p.interval === selectedInterval);
        if (!monthlyPrice || !selectedPrice) return null;

        const monthlyEquivalent = monthlyPrice.unitAmountInCents * INTERVAL_MONTHS[selectedInterval];
        const savings = monthlyEquivalent - selectedPrice.unitAmountInCents;
        if (savings <= 0) return null;

        return `Vous économisez ${formatCentsToEurosString(savings)} sur ${INTERVAL_DISPLAY_NAMES[selectedInterval]}`;
    }, [plan.prices, selectedInterval]);

    if (!selectedInterval) {
        return null;
    }

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="bg-muted/20 border-border rounded-xl border p-6 md:p-8">
                {/* Split-pane: Left (60%) + Divider + Right (40%) */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
                    {/* Left: Duration + Shipping + Savings */}
                    <div className="lg:border-border/60 flex flex-1 flex-col gap-5 lg:border-r lg:pr-8">
                        {/* Header */}
                        <div className="mb-2 flex flex-col gap-1">
                            <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                                Personnalisez votre formule
                            </p>
                            <h3 className="font-heading text-foreground text-xl font-semibold">{planName}</h3>
                        </div>
                        {/* Duration: Pill-style selector */}
                        <div className="flex flex-col gap-3">
                            <span className="text-foreground text-sm font-medium">Durée</span>
                            <div className="bg-muted inline-flex w-fit rounded-full p-1">
                                {plan.prices.map((price) => {
                                    const isSelected = price.interval === selectedInterval;
                                    return (
                                        <button
                                            key={price.interval}
                                            onClick={() => setSelectedInterval(price.interval)}
                                            className={cn(
                                                'cursor-pointer rounded-full px-9 py-2 text-sm font-medium transition-all',
                                                isSelected
                                                    ? 'bg-brand-primary text-white shadow-sm'
                                                    : 'text-text-secondary hover:text-foreground'
                                            )}
                                        >
                                            {INTERVAL_DISPLAY_NAMES[price.interval]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shipping: Two large side-by-side buttons */}
                        {!isDigitalPlan && shippingAddon && (
                            <div className="flex flex-col gap-3">
                                <span className="text-foreground text-sm font-medium">Livraison</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setShipping(plan.planId, SHIPPING_METRO)}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-all',
                                            !isInternational
                                                ? 'border-brand-primary bg-brand-primary/5 text-foreground'
                                                : 'border-border text-text-secondary hover:border-foreground/20 hover:text-foreground'
                                        )}
                                    >
                                        <IconMapPin size={18} stroke={1.5} className="shrink-0" />
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-medium">Métropole</span>
                                            <span className="text-xs opacity-60">Inclus</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setShipping(plan.planId, shippingAddon.productId)}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-all',
                                            isInternational
                                                ? 'border-brand-primary bg-brand-primary/5 text-foreground'
                                                : 'border-border text-text-secondary hover:border-foreground/20 hover:text-foreground'
                                        )}
                                    >
                                        <IconWorld size={18} stroke={1.5} className="shrink-0" />
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-medium">Hors Métropole</span>
                                            {(() => {
                                                const sp = shippingAddon.prices.find(
                                                    (p) => p.interval === selectedInterval
                                                );
                                                return (
                                                    <span className="text-sm opacity-60">
                                                        {sp ? `+${formatCentsToEurosString(sp.unitAmountInCents)}` : ''}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Savings hint */}
                        {savingsText && <p className="text-success mt-1 text-sm font-medium">{savingsText}</p>}
                    </div>

                    {/* Right: Summary sidebar */}
                    <div className="lg:pl-8">
                        <PricingSummary containerClassName="lg:w-72" plan={plan}>
                            <button
                                onClick={handleSubscribe}
                                className="bg-brand-primary hover:bg-brand-primary/90 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors"
                            >
                                Je m&rsquo;abonne
                            </button>
                        </PricingSummary>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useMemo } from 'react';
import type { BillingInterval, PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';

const SHIPPING_METRO = 'metro';

const INTERVAL_LABELS: Record<BillingInterval, string> = {
    monthly: '/mois',
    semester: '/semestre',
    annual: '/an',
    biennial: '/2 ans',
};

function formatCentsToEuros(cents: number): number {
    return Math.round(cents / 100);
}

interface PricingSummaryProps {
    plan: PricingPlan;
    children?: React.ReactNode;
}

export function PricingSummary({ plan, children }: PricingSummaryProps) {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);

    const intervalLabel = selectedInterval ? INTERVAL_LABELS[selectedInterval] : '';
    const basePrice = selectedInterval ? plan.prices.find((p) => p.interval === selectedInterval) : null;
    const basePriceCents = basePrice?.unitAmountInCents ?? 0;

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    const total = useMemo(() => {
        let totalCents = basePriceCents;

        for (const addon of plan.addons) {
            if (addon.category === 'addon' && addonToggles[addon.productId]) {
                const price = addon.prices.find((p) => p.interval === selectedInterval);
                totalCents += price?.unitAmountInCents ?? 0;
            }
            if (addon.category === 'shipping') {
                const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
                if (shippingValue !== SHIPPING_METRO) {
                    const price = addon.prices.find((p) => p.interval === selectedInterval);
                    totalCents += price?.unitAmountInCents ?? 0;
                }
            }
        }

        return formatCentsToEuros(totalCents);
    }, [basePriceCents, plan.addons, plan.planId, addonToggles, shippingSelections, selectedInterval]);

    if (!selectedInterval) return null;

    return (
        <div className="bg-muted/50 flex flex-col gap-4 self-start rounded-xl p-5 lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
            {/* Line items */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Formule {planName}</span>
                    <span className="text-foreground">{formatCentsToEuros(basePriceCents)}€</span>
                </div>
                {plan.addons.map((addon) => {
                    if (addon.category === 'addon' && addonToggles[addon.productId]) {
                        const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                        return (
                            <div key={addon.productId} className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">{addon.name}</span>
                                <span className="text-foreground">
                                    +{formatCentsToEuros(addonPrice?.unitAmountInCents ?? 0)}€
                                </span>
                            </div>
                        );
                    }
                    if (addon.category === 'shipping') {
                        const sv = shippingSelections[plan.planId] ?? SHIPPING_METRO;
                        if (sv !== SHIPPING_METRO) {
                            const sp = addon.prices.find((p) => p.interval === selectedInterval);
                            return (
                                <div key={addon.productId} className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary">Hors Métropole</span>
                                    <span className="text-foreground">
                                        +{formatCentsToEuros(sp?.unitAmountInCents ?? 0)}€
                                    </span>
                                </div>
                            );
                        }
                    }
                    return null;
                })}
            </div>

            {/* Divider */}
            <div className="bg-border h-px w-full" />

            {/* Total */}
            <div className="flex items-baseline justify-between">
                <span className="text-foreground text-base font-semibold">Total</span>
                <div className="flex items-baseline gap-1">
                    <span className="font-heading text-foreground text-2xl font-semibold">{total}€</span>
                    <span className="text-text-secondary text-sm">{intervalLabel}</span>
                </div>
            </div>

            {children}
        </div>
    );
}

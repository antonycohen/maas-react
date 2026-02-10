import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { Switch } from '@maas/web-components';
import { useOAuthStore } from '@maas/core-store-oauth';
import type { BillingInterval, PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { PricingSummary } from './pricing-summary';

const SHIPPING_METRO = 'metro';

const INTERVAL_LABELS: Record<BillingInterval, string> = {
    monthly: '/mois',
    semester: '/semestre',
    annual: '/an',
    biennial: '/2 ans',
};

const INTERVAL_DISPLAY_NAMES: Record<BillingInterval, string> = {
    monthly: '1 mois',
    semester: '6 mois',
    annual: '1 an',
    biennial: '2 ans',
};

function formatCentsToEuros(cents: number): number {
    return Math.round(cents / 100);
}

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
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const toggleAddon = usePricingStore((s) => s.toggleAddon);
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

    const intervalLabel = selectedInterval ? INTERVAL_LABELS[selectedInterval] : '';

    const isDigitalPlan = plan.addons.length === 0;

    const handleSubscribe = () => {
        if (accessToken) {
            navigate('/pricing/informations');
        } else {
            navigate('/pricing/auth');
        }
    };

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    if (!selectedInterval) {
        return null;
    }

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-1">
                    <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                        Personnalisez votre formule
                    </p>
                    <h3 className="font-heading text-foreground text-xl font-semibold">{planName}</h3>
                </div>

                {/* Two-column: Left (customization) + Right (summary) */}
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                    {/* Left: Duration + Options + Shipping */}
                    <div className="flex flex-1 flex-col gap-6">
                        {/* Duration Selection */}
                        <div className="flex flex-col gap-3">
                            <span className="text-foreground text-sm font-medium">Choisissez votre durée</span>
                            <div
                                className={cn(
                                    'grid gap-2',
                                    plan.prices.length <= 3
                                        ? 'grid-cols-1 md:grid-cols-3'
                                        : 'grid-cols-2 md:grid-cols-4'
                                )}
                            >
                                {plan.prices.map((price) => {
                                    const isSelected = price.interval === selectedInterval;
                                    return (
                                        <button
                                            key={price.interval}
                                            onClick={() => setSelectedInterval(price.interval)}
                                            className={cn(
                                                'flex cursor-pointer flex-col items-center justify-center rounded-lg border px-4 py-4 transition-colors',
                                                isSelected
                                                    ? 'border-brand-primary bg-brand-primary/5 text-foreground'
                                                    : 'border-border text-text-secondary hover:text-foreground hover:border-foreground/20'
                                            )}
                                        >
                                            <span className="text-sm font-medium">
                                                {INTERVAL_DISPLAY_NAMES[price.interval]}
                                            </span>
                                            <span className="font-heading text-foreground text-2xl font-semibold">
                                                {formatCentsToEuros(price.unitAmountInCents)}€
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Options + Shipping (non-digital only) */}
                        {!isDigitalPlan &&
                            plan.addons.map((addon) => {
                                if (addon.category === 'addon') {
                                    const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                                    const priceText = addonPrice
                                        ? `+${formatCentsToEurosString(addonPrice.unitAmountInCents)} ${intervalLabel}`
                                        : '';
                                    const checked = addonToggles[addon.productId] ?? false;

                                    return (
                                        <label
                                            key={addon.productId}
                                            className="border-border hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={checked}
                                                    onCheckedChange={(val) => toggleAddon(addon.productId, val)}
                                                />
                                                <span className="text-foreground text-sm font-medium">
                                                    {addon.name}
                                                </span>
                                            </div>
                                            <span className="text-text-secondary text-sm font-medium">{priceText}</span>
                                        </label>
                                    );
                                }

                                // shipping
                                const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
                                const shippingPrice = addon.prices.find((p) => p.interval === selectedInterval);
                                const shippingPriceText = shippingPrice
                                    ? `+${formatCentsToEurosString(shippingPrice.unitAmountInCents)} ${intervalLabel}`
                                    : '';

                                return (
                                    <div key={addon.productId} className="flex flex-col gap-2">
                                        <span className="text-foreground text-sm font-medium">{addon.name}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShipping(plan.planId, SHIPPING_METRO)}
                                                className={cn(
                                                    'flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                                                    shippingValue === SHIPPING_METRO
                                                        ? 'border-brand-primary bg-brand-primary/5 text-foreground'
                                                        : 'border-border text-text-secondary hover:text-foreground hover:border-foreground/20'
                                                )}
                                            >
                                                France métropolitaine
                                                <span className="ml-1 text-xs opacity-60">Inclus</span>
                                            </button>
                                            <button
                                                onClick={() => setShipping(plan.planId, addon.productId)}
                                                className={cn(
                                                    'flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                                                    shippingValue === addon.productId
                                                        ? 'border-brand-primary bg-brand-primary/5 text-foreground'
                                                        : 'border-border text-text-secondary hover:text-foreground hover:border-foreground/20'
                                                )}
                                            >
                                                Hors Métropole
                                                <span className="ml-1 text-xs opacity-60">{shippingPriceText}</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Right: Summary sidebar */}
                    <PricingSummary plan={plan}>
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
    );
}

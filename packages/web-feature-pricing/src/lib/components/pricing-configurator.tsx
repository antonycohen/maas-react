import { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { Switch } from '@maas/web-components';
import { useCreateCheckoutSession, ApiError, AuthenticationError, CheckoutSession } from '@maas/core-api';
import type { BillingInterval, PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';

const SHIPPING_METRO = 'metro';

const INTERVAL_LABELS: Record<BillingInterval, string> = {
    semester: '/semestre',
    annual: '/an',
    biennial: '/2 ans',
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
    selectedInterval: BillingInterval;
}

export function PricingConfigurator({ plan, selectedInterval }: PricingConfiguratorProps) {
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const toggleAddon = usePricingStore((s) => s.toggleAddon);
    const setShipping = usePricingStore((s) => s.setShipping);

    const navigate = useNavigate();
    const location = useLocation();
    const checkoutMutation = useCreateCheckoutSession();

    const intervalLabel = INTERVAL_LABELS[selectedInterval];

    // Base price
    const basePrice = plan.prices.find((p) => p.interval === selectedInterval);
    const basePriceCents = basePrice?.unitAmountInCents ?? 0;

    // Compute total
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

    // Collect selected price IDs for checkout
    const selectedPriceIds = useMemo(() => {
        const priceIds: string[] = [];

        // Base price
        if (basePrice?.priceId) {
            priceIds.push(basePrice.priceId);
        }

        // Enabled addons
        for (const addon of plan.addons) {
            if (addon.category === 'addon' && addonToggles[addon.productId]) {
                const price = addon.prices.find((p) => p.interval === selectedInterval);
                if (price?.priceId) {
                    priceIds.push(price.priceId);
                }
            }
            if (addon.category === 'shipping') {
                const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
                if (shippingValue !== SHIPPING_METRO) {
                    const price = addon.prices.find((p) => p.interval === selectedInterval);
                    if (price?.priceId) {
                        priceIds.push(price.priceId);
                    }
                }
            }
        }

        return priceIds;
    }, [basePrice, plan.addons, plan.planId, addonToggles, shippingSelections, selectedInterval]);

    const handleCheckout = useCallback(() => {
        const homeUrl = `${window.location.origin}/`;

        checkoutMutation.mutate(
            {
                priceIds: selectedPriceIds,
                successUrl: homeUrl,
                cancelUrl: homeUrl,
            },
            {
                onSuccess: (data: CheckoutSession) => {
                    window.location.href = data.checkoutSession.checkoutUrl;
                },
                onError: (error) => {
                    if (error instanceof AuthenticationError) {
                        localStorage.setItem('target-url', `${location.pathname}${location.search}`);
                        navigate('/login');
                    }
                },
            }
        );
    }, [selectedPriceIds, checkoutMutation, location.pathname, location.search, navigate]);

    const hasAddons = plan.addons.length > 0;
    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

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

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                    {/* Left: Options */}
                    {hasAddons && (
                        <div className="flex flex-1 flex-col gap-5">
                            {plan.addons.map((addon) => {
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
                                                <div className="flex flex-col">
                                                    <span className="text-foreground text-sm font-medium">
                                                        {addon.name}
                                                    </span>
                                                </div>
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
                    )}

                    {/* Right: Total + CTA */}
                    <div
                        className={cn(
                            'bg-muted/50 flex flex-col gap-4 rounded-xl p-5',
                            hasAddons ? 'lg:w-80 lg:shrink-0' : 'w-full'
                        )}
                    >
                        {/* Line items */}
                        <div className="flex min-h-12 flex-col gap-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">Formule {planName}</span>
                                <span className="text-foreground">{formatCentsToEuros(basePriceCents)}€</span>
                            </div>
                            {plan.addons.map((addon) => {
                                if (addon.category === 'addon' && addonToggles[addon.productId]) {
                                    const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                                    return (
                                        <div
                                            key={addon.productId}
                                            className="flex items-center justify-between text-sm"
                                        >
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
                                            <div
                                                key={addon.productId}
                                                className="flex items-center justify-between text-sm"
                                            >
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
                                <span className="font-heading text-foreground text-3xl font-semibold">{total}€</span>
                                <span className="text-text-secondary text-sm">{intervalLabel}</span>
                            </div>
                        </div>

                        {/* Subscribe button */}
                        <button
                            onClick={handleCheckout}
                            disabled={checkoutMutation.isPending || selectedPriceIds.length === 0}
                            className={cn(
                                'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                                checkoutMutation.isPending && 'cursor-wait opacity-70'
                            )}
                        >
                            {checkoutMutation.isPending ? 'Redirection...' : 'Je m\u2019abonne'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

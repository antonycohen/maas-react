import { useMemo, useState } from 'react';
import { Switch } from '@maas/web-components';
import type { BillingInterval, PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { cn } from '@maas/core-utils';

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

function formatCentsToEurosString(cents: number): string {
    const euros = cents / 100;
    return euros % 1 === 0 ? `${euros}€` : `${euros.toFixed(2)}€`;
}

interface PricingSummaryProps {
    plan: PricingPlan;
    children?: React.ReactNode;
    /** When true, only show toggles for addons that are NOT already checked (checked ones appear as line items). */
    hideCheckedAddonToggles?: boolean;
    containerClassName?: string;
}

export function PricingSummary({ plan, children, hideCheckedAddonToggles, containerClassName }: PricingSummaryProps) {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const toggleAddon = usePricingStore((s) => s.toggleAddon);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);

    const intervalLabel = selectedInterval ? INTERVAL_LABELS[selectedInterval] : '';
    const basePrice = selectedInterval ? plan.prices.find((p) => p.interval === selectedInterval) : null;
    const basePriceCents = basePrice?.unitAmountInCents ?? 0;

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    // Snapshot addon IDs that were already checked when this component first mounted.
    // Only these get hidden — addons toggled on/off by the user on this page stay visible.
    const [initiallyCheckedIds] = useState(() =>
        hideCheckedAddonToggles
            ? new Set(
                  plan.addons.filter((a) => a.category === 'addon' && addonToggles[a.productId]).map((a) => a.productId)
              )
            : null
    );

    const addonItems = plan.addons.filter((a) => a.category === 'addon' && !initiallyCheckedIds?.has(a.productId));

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
        <div
            className={cn(
                'border-border bg-muted/50 flex w-full flex-col gap-4 self-center rounded-xl border p-5 lg:sticky lg:top-6 lg:shrink-0',
                containerClassName
            )}
        >
            {/* Line items */}
            <div className="flex h-20 flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Formule {planName}</span>
                    <span className="text-foreground">{formatCentsToEuros(basePriceCents)}€</span>
                </div>
                {plan.addons.map((addon) => {
                    if (addon.category === 'addon' && addonToggles[addon.productId]) {
                        const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                        return (
                            <div key={addon.productId} className="flex items-center justify-between text-sm">
                                <span className="text-text-secondary">
                                    {(addon?.metadata?.displayName as string) ?? addon.name}
                                </span>
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

            {/* Addon toggles (e.g. Option XXL) — above divider/total */}
            {addonItems.length > 0 && (
                <div className="flex flex-col gap-2">
                    {addonItems.map((addon) => {
                        const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                        const priceText = addonPrice
                            ? `+${formatCentsToEurosString(addonPrice.unitAmountInCents)}`
                            : '';
                        const checked = addonToggles[addon.productId] ?? false;

                        return (
                            <label
                                key={addon.productId}
                                className="hover:bg-muted/80 flex cursor-pointer items-center justify-between rounded-lg px-0 py-2 transition-colors"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Switch
                                        checked={checked}
                                        onCheckedChange={(val) => toggleAddon(addon.productId, val)}
                                    />
                                    <span className="text-foreground text-sm font-medium">
                                        {(addon?.metadata?.displayName as string) ?? addon.name}
                                    </span>
                                </div>
                                <span className="text-text-secondary text-xs font-medium">{priceText}</span>
                            </label>
                        );
                    })}
                </div>
            )}

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

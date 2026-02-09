import { useMemo } from 'react';
import { PricingCard, type PricingCardProps } from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { usePricingData, type BillingInterval } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { PricingConfigurator } from './pricing-configurator';

const INTERVAL_OPTIONS: { value: BillingInterval; label: string; shortLabel: string }[] = [
    { value: 'semester', label: 'Semestre', shortLabel: '/semestre' },
    { value: 'annual', label: 'Annuel', shortLabel: '/an' },
    { value: 'biennial', label: 'Biennal', shortLabel: '/2 ans' },
];

const FEATURE_DISPLAY_NAMES: Record<string, string> = {
    tangente_mag: 'Tangente Magazine',
    hors_serie: 'Hors-Série',
    digital_access: 'Accès Numérique Illimité',
};

function formatCentsToEuros(cents: number): number {
    return Math.round(cents / 100);
}

function IntervalSelector({
    selected,
    onChange,
}: {
    selected: BillingInterval;
    onChange: (interval: BillingInterval) => void;
}) {
    return (
        <div className="border-border bg-background flex items-center gap-1 rounded-lg border p-1">
            {INTERVAL_OPTIONS.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors',
                        selected === option.value
                            ? 'bg-foreground text-background shadow-sm'
                            : 'text-text-secondary hover:text-foreground'
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function PricingListSkeleton() {
    return (
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border-border flex animate-pulse flex-col gap-6 rounded-xl border p-5">
                    <div className="bg-muted h-6 w-24 rounded" />
                    <div className="flex flex-col gap-2">
                        <div className="bg-muted h-8 w-40 rounded" />
                        <div className="bg-muted h-12 w-24 rounded" />
                        <div className="bg-muted h-16 w-full rounded" />
                    </div>
                    <div className="bg-muted h-10 w-full rounded" />
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="bg-muted h-5 w-full rounded" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PricingList() {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const selectedPlanId = usePricingStore((s) => s.selectedPlanId);
    const setSelectedInterval = usePricingStore((s) => s.setSelectedInterval);
    const setSelectedPlanId = usePricingStore((s) => s.setSelectedPlanId);

    const { pricingPlans, isLoading, isError } = usePricingData();

    const selectedPlan = useMemo(
        () => pricingPlans.find((p) => p.planId === selectedPlanId) ?? null,
        [pricingPlans, selectedPlanId]
    );

    const cards = useMemo((): PricingCardProps[] => {
        return pricingPlans.map((plan) => {
            const currentPrice = plan.prices.find((p) => p.interval === selectedInterval);
            const currentOption = INTERVAL_OPTIONS.find((o) => o.value === selectedInterval);

            // Build feature texts with quotas
            const features = plan.features.map((f) => {
                const displayName = FEATURE_DISPLAY_NAMES[f.lookupKey] ?? f.displayName;
                if (f.withQuota) {
                    const quota = f.quotas[selectedInterval];
                    return {
                        text: quota != null ? `${quota} numéros de ${displayName}` : displayName,
                    };
                }
                return { text: displayName };
            });
            features.push({ text: 'Résiliable à tout moment.' });

            // Determine tags from plan metadata
            const tags: PricingCardProps['tags'] = [];
            const metadata = plan.metadata;
            if (metadata?.tag) {
                tags.push({ label: metadata.tag as string, style: 'Accent' as const });
            }
            if (metadata?.tagSecondary) {
                tags.push({ label: metadata.tagSecondary as string, style: 'Light' as const });
            }

            return {
                title: (metadata?.titlePrefix as string) ?? 'Tangente',
                titleSuffix: (metadata?.titleSuffix as string) ?? plan.name,
                price: currentPrice ? formatCentsToEuros(currentPrice.unitAmountInCents) : 0,
                priceLabel: currentOption?.shortLabel,
                description: plan.description,
                features,
                tags: tags.length > 0 ? tags : undefined,
                isHighlighted: metadata?.highlighted === true,
                isSelected: plan.planId === selectedPlanId,
                onSelect: () => setSelectedPlanId(plan.planId),
            };
        });
    }, [pricingPlans, selectedInterval, selectedPlanId, setSelectedPlanId]);

    return (
        <div className="container mx-auto flex w-full flex-col items-center gap-6 px-5 py-10 xl:px-0">
            <h2 className="font-heading leading-3xl mb-4 text-center text-3xl font-semibold tracking-[-1.32px] md:text-[48px] md:leading-[52px]">
                <span className="text-foreground">Toutes les formules </span>
                <span className="text-brand-primary">Tangente Magazine</span>
            </h2>

            <IntervalSelector selected={selectedInterval} onChange={setSelectedInterval} />

            {isLoading && <PricingListSkeleton />}

            {isError && (
                <p className="text-destructive text-sm">
                    Une erreur est survenue lors du chargement des formules. Veuillez réessayer.
                </p>
            )}

            {!isLoading && !isError && cards.length > 0 && (
                <div
                    className={cn(
                        'grid w-full gap-5',
                        cards.length <= 3
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    )}
                >
                    {cards.map((card, index) => (
                        <PricingCard key={index} {...card} />
                    ))}
                </div>
            )}

            {selectedPlan && <PricingConfigurator plan={selectedPlan} selectedInterval={selectedInterval} />}
        </div>
    );
}

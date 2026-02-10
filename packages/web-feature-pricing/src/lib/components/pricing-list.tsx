import { useMemo } from 'react';
import { PricingCard, type PricingCardProps } from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { usePricingData, type BillingInterval } from '../hooks/use-pricing-data';
import { usePricingStore } from '../store/pricing-store';
import { PricingConfigurator } from './pricing-configurator';

const FEATURE_DISPLAY_NAMES: Record<string, string> = {
    tangente_mag: 'Tangente Magazine',
    hors_serie: 'Hors-Série',
    digital_access: 'Accès Numérique Illimité',
};

const INTERVAL_LABELS: Record<BillingInterval, string> = {
    monthly: '/mois',
    semester: '/semestre',
    annual: '/an',
    biennial: '/2 ans',
};

function formatCentsToEuros(cents: number): number {
    return Math.round(cents / 100);
}

function PricingListSkeleton() {
    return (
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
    const currentStep = usePricingStore((s) => s.currentStep);
    const selectedPlanId = usePricingStore((s) => s.selectedPlanId);
    const setSelectedPlanId = usePricingStore((s) => s.setSelectedPlanId);
    const setCurrentStep = usePricingStore((s) => s.setCurrentStep);

    const { pricingPlans, isLoading, isError } = usePricingData();

    const selectedPlan = useMemo(
        () => pricingPlans.find((p) => p.planId === selectedPlanId) ?? null,
        [pricingPlans, selectedPlanId]
    );

    const cards = useMemo((): PricingCardProps[] => {
        return pricingPlans.map((plan) => {
            // Find the cheapest price across all intervals
            const cheapestPrice =
                plan.prices.length > 0
                    ? plan.prices.reduce((min, price) =>
                          price.unitAmountInCents < min.unitAmountInCents ? price : min
                      )
                    : null;

            const intervalLabel = cheapestPrice ? INTERVAL_LABELS[cheapestPrice.interval] : '';

            // Build feature texts (without quotas since no interval is selected yet)
            const features = plan.features.map((f) => {
                const displayName = FEATURE_DISPLAY_NAMES[f.lookupKey] ?? f.displayName;
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
                title: !(metadata?.pricingSettings?.hideTitlePrefix as boolean)
                    ? (metadata?.titlePrefix as string)
                    : 'Tangente',
                titleSuffix: (metadata?.titleSuffix as string) ?? plan.name,
                price: cheapestPrice ? formatCentsToEuros(cheapestPrice.unitAmountInCents) : 0,
                priceLabel: cheapestPrice ? `À partir de ${intervalLabel}` : undefined,
                description: plan.description,
                features,
                tags: tags.length > 0 ? tags : undefined,
                isHighlighted: metadata?.highlighted === true,
                isSelected: plan.planId === selectedPlanId,
                onSelect: () => {
                    setSelectedPlanId(plan.planId);
                    setCurrentStep('configure');
                },
            };
        });
    }, [pricingPlans, selectedPlanId, setSelectedPlanId, setCurrentStep]);

    return (
        <div className="container mx-auto flex w-full flex-col items-center gap-6 px-5 py-10 xl:px-0">
            <h2 className="font-heading leading-3xl mb-4 text-center text-3xl font-semibold tracking-[-1.32px] md:text-[48px] md:leading-[52px]">
                <span className="text-foreground">Toutes les formules </span>
                <span className="text-brand-primary">Tangente Magazine</span>
            </h2>

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

            {currentStep === 'configure' && selectedPlan && <PricingConfigurator plan={selectedPlan} />}
        </div>
    );
}

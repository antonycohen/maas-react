import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { type Product, type Price, type ProductFeature } from '@maas/core-api-models';
import { getPlans, getProducts, getPrices, getProductFeatures } from '@maas/core-api';

// --- Types ---

export type BillingInterval = 'semester' | 'annual' | 'biennial';

export interface PlanPricing {
    interval: BillingInterval;
    unitAmountInCents: number;
    priceId: string;
}

export interface PlanFeatureQuota {
    featureId: string;
    lookupKey: string;
    displayName: string;
    withQuota: boolean;
    quotas: Record<BillingInterval, number | null>;
}

export interface PlanAddon {
    productId: string;
    name: string;
    category: 'addon' | 'shipping';
    prices: PlanPricing[];
}

export interface PricingPlan {
    planId: string;
    name: string;
    description: string;
    metadata: Record<string, unknown>;
    mainProduct: Product | null;
    features: PlanFeatureQuota[];
    prices: PlanPricing[];
    addons: PlanAddon[];
}

// --- Helpers ---

const INTERVAL_MAP: Record<string, BillingInterval> = {
    month_6: 'semester',
    year_1: 'annual',
    year_2: 'biennial',
};

function toBillingInterval(price: Price): BillingInterval | null {
    const interval = price.recurringInterval;
    const count = price.recurringIntervalCount ?? 1;
    const key = `${interval}_${count}`;
    return INTERVAL_MAP[key] ?? null;
}

function buildPlanPricing(prices: Price[]): PlanPricing[] {
    return prices
        .map((p) => {
            const interval = toBillingInterval(p);
            if (!interval) return null;
            return {
                interval,
                unitAmountInCents: p.unitAmountInCents ?? 0,
                priceId: p.id,
            };
        })
        .filter((p): p is PlanPricing => p !== null);
}

function buildFeatureQuotas(productFeatures: ProductFeature[], productPrices: Price[]): PlanFeatureQuota[] {
    return productFeatures.map((pf) => {
        const quotas: Record<BillingInterval, number | null> = {
            semester: null,
            annual: null,
            biennial: null,
        };

        // Quotas are stored on prices (price.quotas[featureLookupKey])
        for (const price of productPrices) {
            const interval = toBillingInterval(price);
            if (!interval) continue;
            const priceQuotas = price.quotas as Record<string, number | null> | null;
            if (priceQuotas && pf.feature.lookupKey && priceQuotas[pf.feature.lookupKey] != null) {
                quotas[interval] = priceQuotas[pf.feature.lookupKey] as number;
            }
        }

        return {
            featureId: pf.feature.id,
            lookupKey: pf.feature.lookupKey ?? '',
            displayName: pf.feature.displayName ?? pf.feature.lookupKey ?? '',
            withQuota: pf.feature.withQuota ?? false,
            quotas,
        };
    });
}

// --- Hook ---

export function usePricingData() {
    // Step 1: Fetch plans and all products + prices in parallel
    const [plansQuery, productsQuery, pricesQuery] = useQueries({
        queries: [
            {
                queryKey: ['plans', { filters: { active: true }, offset: 0, limit: 100 }],
                queryFn: () =>
                    getPlans({
                        filters: { active: true },
                        offset: 0,
                        limit: 100,
                        fields: {
                            id: null,
                            name: null,
                            description: null,
                            active: null,
                            metadata: null,
                        },
                    }),
            },
            {
                queryKey: ['products', { filters: { active: true }, offset: 0, limit: 100 }],
                queryFn: () =>
                    getProducts({
                        filters: { active: true },
                        offset: 0,
                        limit: 100,
                        fields: {
                            id: null,
                            name: null,
                            description: null,
                            active: null,
                            type: null,
                            plan: { fields: { id: null, name: null } },
                            metadata: null,
                            quotas: null,
                        },
                    }),
            },
            {
                queryKey: ['prices', { filters: { active: true }, offset: 0, limit: 200 }],
                queryFn: () =>
                    getPrices({
                        filters: { active: true },
                        offset: 0,
                        limit: 200,
                        fields: {
                            id: null,
                            product: { fields: { id: null, name: null } },
                            currency: null,
                            recurringInterval: null,
                            recurringIntervalCount: null,
                            unitAmountInCents: null,
                            active: null,
                            metadata: null,
                            quotas: null,
                        },
                    }),
            },
        ],
    });

    const plansData = plansQuery.data;
    const productsData = productsQuery.data;
    const pricesData = pricesQuery.data;

    // Step 2: For each "main" product, fetch its attached features
    const mainProducts = useMemo(
        () =>
            (productsData?.data ?? []).filter(
                (p) => (p.metadata as Record<string, unknown> | null)?.category === 'main'
            ),
        [productsData]
    );

    const featureQueries = useQueries({
        queries: mainProducts.map((product) => ({
            queryKey: ['products', product.id, 'features'],
            queryFn: () => getProductFeatures({ productId: product.id }),
            enabled: mainProducts.length > 0,
        })),
    });

    // Step 3: Build the final pricing plan structures
    const pricingPlans = useMemo((): PricingPlan[] => {
        const plans = plansData?.data ?? [];
        const products = productsData?.data ?? [];
        const prices = pricesData?.data ?? [];

        if (!plans.length || !products.length || !prices.length) return [];

        // Index products by plan ID
        const productsByPlan = new Map<string, Product[]>();
        for (const product of products) {
            const planId = product.plan?.id;
            if (!planId) continue;
            const existing = productsByPlan.get(planId) ?? [];
            existing.push(product);
            productsByPlan.set(planId, existing);
        }

        // Index prices by product ID
        const pricesByProduct = new Map<string, Price[]>();
        for (const price of prices) {
            const productId = price.product?.id;
            if (!productId) continue;
            const existing = pricesByProduct.get(productId) ?? [];
            existing.push(price);
            pricesByProduct.set(productId, existing);
        }

        // Index feature queries by product ID
        const featuresByProduct = new Map<string, ProductFeature[]>();
        mainProducts.forEach((product, index) => {
            const query = featureQueries[index];
            if (query?.data) {
                featuresByProduct.set(product.id, query.data);
            }
        });

        return plans.map((plan): PricingPlan => {
            const planProducts = productsByPlan.get(plan.id) ?? [];
            const mainProduct =
                planProducts.find((p) => (p.metadata as Record<string, unknown> | null)?.category === 'main') ?? null;

            const mainProductPrices = mainProduct ? (pricesByProduct.get(mainProduct.id) ?? []) : [];
            const productFeatures = mainProduct ? (featuresByProduct.get(mainProduct.id) ?? []) : [];

            // Build addon information
            const addons: PlanAddon[] = planProducts
                .filter((p) => {
                    const cat = (p.metadata as Record<string, unknown> | null)?.category;
                    return cat === 'addon' || cat === 'shipping';
                })
                .map((p) => ({
                    productId: p.id,
                    name: p.name ?? '',
                    category: (p.metadata as Record<string, unknown>)?.category as 'addon' | 'shipping',
                    prices: buildPlanPricing(pricesByProduct.get(p.id) ?? []),
                }));

            return {
                planId: plan.id,
                name: plan.name ?? '',
                description: plan.description ?? '',
                metadata: (plan.metadata as Record<string, unknown>) ?? {},
                mainProduct,
                features: buildFeatureQuotas(productFeatures, mainProductPrices),
                prices: buildPlanPricing(mainProductPrices),
                addons,
            };
        });
    }, [plansData, productsData, pricesData, mainProducts, featureQueries]);

    const isLoading =
        plansQuery.isLoading ||
        productsQuery.isLoading ||
        pricesQuery.isLoading ||
        featureQueries.some((q) => q.isLoading);

    const isError =
        plansQuery.isError || productsQuery.isError || pricesQuery.isError || featureQueries.some((q) => q.isError);

    return {
        pricingPlans,
        isLoading,
        isError,
    };
}

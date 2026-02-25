import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { type Product, type Price, type ProductFeature } from '@maas/core-api-models';
import { getPlans, getProducts, getPrices, getProductFeatures, useCreateCustomerSubscription } from '@maas/core-api';
import { useNavigate } from 'react-router';
import { useRoutes } from '@maas/core-workspace';
import {
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
    Switch,
} from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

// --- Types (same structure as pricing feature) ---

type BillingInterval = 'monthly' | 'semester' | 'annual' | 'biennial';

interface PlanPricing {
    interval: BillingInterval;
    unitAmountInCents: number;
    priceId: string;
}

interface PlanAddon {
    productId: string;
    name: string;
    category: 'addon' | 'shipping';
    prices: PlanPricing[];
    metadata: Record<string, unknown> | null;
}

interface PlanFeatureQuota {
    featureId: string;
    lookupKey: string;
    displayName: string;
    withQuota: boolean;
}

interface AdminPricingPlan {
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
    month_1: 'monthly',
    month_6: 'semester',
    year_1: 'annual',
    year_2: 'biennial',
};

const INTERVAL_LABELS: Record<BillingInterval, string> = {
    monthly: '1 mois',
    semester: '6 mois',
    annual: '1 an',
    biennial: '2 ans',
};

const INTERVAL_SHORT: Record<BillingInterval, string> = {
    monthly: '/mois',
    semester: '/sem.',
    annual: '/an',
    biennial: '/2 ans',
};

function toBillingInterval(price: Price): BillingInterval | null {
    const key = `${price.recurringInterval}_${price.recurringIntervalCount ?? 1}`;
    return INTERVAL_MAP[key] ?? null;
}

function buildPlanPricing(prices: Price[]): PlanPricing[] {
    return prices
        .map((p) => {
            const interval = toBillingInterval(p);
            if (!interval) return null;
            return { interval, unitAmountInCents: p.unitAmountInCents ?? 0, priceId: p.id };
        })
        .filter((p): p is PlanPricing => p !== null);
}

function formatCents(cents: number): string {
    const euros = cents / 100;
    return euros % 1 === 0 ? `${euros}€` : `${euros.toFixed(2)}€`;
}

// --- Data hook ---

function useAdminPricingData() {
    const [plansQuery, productsQuery, pricesQuery] = useQueries({
        queries: [
            {
                queryKey: ['plans', { filters: { active: true }, offset: 0, limit: 100 }],
                queryFn: () =>
                    getPlans({
                        filters: { active: true },
                        offset: 0,
                        limit: 100,
                        fields: { id: null, name: null, description: null, active: null, metadata: null },
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
                        },
                    }),
            },
        ],
    });

    const mainProducts = useMemo(
        () =>
            (productsQuery.data?.data ?? []).filter(
                (p) => (p.metadata as Record<string, unknown> | null)?.category === 'main'
            ),
        [productsQuery.data]
    );

    const featureQueries = useQueries({
        queries: mainProducts.map((product) => ({
            queryKey: ['products', product.id, 'features'],
            queryFn: () => getProductFeatures({ productId: product.id }),
            enabled: mainProducts.length > 0,
        })),
    });

    const pricingPlans = useMemo((): AdminPricingPlan[] => {
        const plans = plansQuery.data?.data ?? [];
        const products = productsQuery.data?.data ?? [];
        const prices = pricesQuery.data?.data ?? [];
        if (!plans.length || !products.length || !prices.length) return [];

        const productsByPlan = new Map<string, Product[]>();
        for (const product of products) {
            const planId = product.plan?.id;
            if (!planId) continue;
            const arr = productsByPlan.get(planId) ?? [];
            arr.push(product);
            productsByPlan.set(planId, arr);
        }

        const pricesByProduct = new Map<string, Price[]>();
        for (const price of prices) {
            const productId = price.product?.id;
            if (!productId) continue;
            const arr = pricesByProduct.get(productId) ?? [];
            arr.push(price);
            pricesByProduct.set(productId, arr);
        }

        const featuresByProduct = new Map<string, ProductFeature[]>();
        mainProducts.forEach((product, index) => {
            if (featureQueries[index]?.data) {
                featuresByProduct.set(product.id, featureQueries[index].data);
            }
        });

        return plans.map((plan): AdminPricingPlan => {
            const planProducts = productsByPlan.get(plan.id) ?? [];
            const mainProduct =
                planProducts.find((p) => (p.metadata as Record<string, unknown> | null)?.category === 'main') ?? null;
            const mainPrices = mainProduct ? (pricesByProduct.get(mainProduct.id) ?? []) : [];
            const productFeatures = mainProduct ? (featuresByProduct.get(mainProduct.id) ?? []) : [];

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
                    metadata: p.metadata,
                }));

            return {
                planId: plan.id,
                name: plan.name ?? '',
                description: plan.description ?? '',
                metadata: (plan.metadata as Record<string, unknown>) ?? {},
                mainProduct,
                features: productFeatures.map((pf) => ({
                    featureId: pf.feature.id,
                    lookupKey: pf.feature.lookupKey ?? '',
                    displayName: pf.feature.displayName ?? pf.feature.lookupKey ?? '',
                    withQuota: pf.feature.withQuota ?? false,
                })),
                prices: buildPlanPricing(mainPrices),
                addons,
            };
        });
    }, [plansQuery.data, productsQuery.data, pricesQuery.data, mainProducts, featureQueries]);

    const isLoading =
        plansQuery.isLoading ||
        productsQuery.isLoading ||
        pricesQuery.isLoading ||
        featureQueries.some((q) => q.isLoading);

    return { pricingPlans, isLoading };
}

// --- Component ---

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
};

type Step = 'plan' | 'configure';

type PaymentMethod = 'card' | 'cheque' | 'virement' | 'prelevement';

const PAYMENT_METHODS: PaymentMethod[] = ['card', 'cheque', 'virement', 'prelevement'];

const PAYMENT_METHOD_TRANSLATION_KEYS: Record<PaymentMethod, string> = {
    card: 'customers.subscriptions.paymentMethodCard',
    cheque: 'customers.subscriptions.paymentMethodCheque',
    virement: 'customers.subscriptions.paymentMethodVirement',
    prelevement: 'customers.subscriptions.paymentMethodPrelevement',
};

export const CreateSubscriptionDialog = ({ open, onOpenChange, customerId }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routes = useRoutes();
    const { pricingPlans, isLoading } = useAdminPricingData();

    const [step, setStep] = useState<Step>('plan');
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [selectedInterval, setSelectedInterval] = useState<BillingInterval | null>(null);
    const [addonToggles, setAddonToggles] = useState<Record<string, boolean>>({});
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

    const selectedPlan = pricingPlans.find((p) => p.planId === selectedPlanId) ?? null;

    const { mutate: createSubscription, isPending } = useCreateCustomerSubscription({
        onSuccess: (data) => {
            toast.success(t('customers.subscriptions.subscriptionCreated'));
            if (data?.customer?.id) {
                navigate(routes.customerInfo(data.customer.id), { replace: true });
            }
        },
        onError: () => {
            toast.error(t('customers.subscriptions.createError'));
        },
    });

    const resetForm = () => {
        setStep('plan');
        setSelectedPlanId(null);
        setSelectedInterval(null);
        setAddonToggles({});
        setPaymentMethod('card');
    };

    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
        const plan = pricingPlans.find((p) => p.planId === planId);
        if (plan) {
            const defaultInterval =
                plan.prices.find((p) => p.interval === 'annual')?.interval ?? plan.prices[0]?.interval ?? null;
            setSelectedInterval(defaultInterval);
        }
        setAddonToggles({});
        setStep('configure');
    };

    const handleBack = () => {
        setStep('plan');
    };

    const handleSubmit = () => {
        if (!selectedPlan || !selectedInterval) return;

        const basePrice = selectedPlan.prices.find((p) => p.interval === selectedInterval);
        if (!basePrice) return;

        const priceIds = [basePrice.priceId];

        for (const addon of selectedPlan.addons) {
            if (addon.category === 'addon' && addonToggles[addon.productId]) {
                const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                if (addonPrice) priceIds.push(addonPrice.priceId);
            }
        }

        const subscriptionData = {
            priceIds,
            paymentMethod,
            metadata: { manual: true },
        };

        createSubscription({
            customerId,
            data: subscriptionData,
        });
    };

    // Calculate total
    const totalCents = useMemo(() => {
        if (!selectedPlan || !selectedInterval) return 0;
        const base = selectedPlan.prices.find((p) => p.interval === selectedInterval)?.unitAmountInCents ?? 0;
        let addonsTotal = 0;
        for (const addon of selectedPlan.addons) {
            if (addon.category === 'addon' && addonToggles[addon.productId]) {
                addonsTotal += addon.prices.find((p) => p.interval === selectedInterval)?.unitAmountInCents ?? 0;
            }
        }
        return base + addonsTotal;
    }, [selectedPlan, selectedInterval, addonToggles]);

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!o) resetForm();
                onOpenChange(o);
            }}
        >
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('customers.subscriptions.createSubscription')}</DialogTitle>
                    <DialogDescription>{t('customers.subscriptions.createSubscriptionDescription')}</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                ) : step === 'plan' ? (
                    /* ─── Step 1: Select Plan ─── */
                    <div className="flex flex-col gap-3">
                        <Label className="text-sm font-medium">{t('customers.subscriptions.selectPlan')}</Label>
                        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto">
                            {pricingPlans.map((plan) => {
                                const cheapest =
                                    plan.prices.length > 0
                                        ? plan.prices.reduce((min, p) =>
                                              p.unitAmountInCents < min.unitAmountInCents ? p : min
                                          )
                                        : null;
                                const isSelected = plan.planId === selectedPlanId;
                                const planDisplayName = plan.metadata?.titleSuffix
                                    ? `${(plan.metadata.titlePrefix as string) ?? ''} ${plan.metadata.titleSuffix as string}`.trim()
                                    : plan.name;

                                return (
                                    <button
                                        key={plan.planId}
                                        type="button"
                                        onClick={() => handleSelectPlan(plan.planId)}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all',
                                            isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <div className="flex flex-1 flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{planDisplayName}</span>
                                                {plan.metadata?.tag ? (
                                                    <Badge variant="outline" className="text-xs">
                                                        {String(plan.metadata.tag)}
                                                    </Badge>
                                                ) : null}
                                            </div>
                                            <span className="text-muted-foreground text-xs">{plan.description}</span>
                                            {plan.features.length > 0 && (
                                                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                                    {plan.features.map((f) => (
                                                        <span
                                                            key={f.featureId}
                                                            className="text-muted-foreground flex items-center gap-1 text-xs"
                                                        >
                                                            <IconCheck className="text-success h-3 w-3" />
                                                            {f.displayName}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {cheapest && (
                                            <div className="text-right">
                                                <span className="text-lg font-semibold">
                                                    {formatCents(cheapest.unitAmountInCents)}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    {INTERVAL_SHORT[cheapest.interval]}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : selectedPlan ? (
                    /* ─── Step 2: Configure ─── */
                    <div className="flex flex-col gap-5">
                        {/* Back button */}
                        <button
                            type="button"
                            onClick={handleBack}
                            className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm"
                        >
                            <IconArrowLeft className="h-4 w-4" />
                            {t('common.back')}
                        </button>

                        {/* Plan name */}
                        <div>
                            <h4 className="text-sm font-semibold">
                                {selectedPlan.metadata?.titleSuffix
                                    ? `${(selectedPlan.metadata.titlePrefix as string) ?? ''} ${selectedPlan.metadata.titleSuffix as string}`.trim()
                                    : selectedPlan.name}
                            </h4>
                        </div>

                        {/* Billing Interval */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('customers.subscriptions.duration')}</Label>
                            <div className="bg-muted inline-flex w-fit rounded-full p-1">
                                {selectedPlan.prices.map((price) => {
                                    const isActive = price.interval === selectedInterval;
                                    return (
                                        <button
                                            key={price.interval}
                                            type="button"
                                            onClick={() => setSelectedInterval(price.interval)}
                                            className={cn(
                                                'cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium transition-all',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            )}
                                        >
                                            {INTERVAL_LABELS[price.interval]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Addons */}
                        {selectedPlan.addons.filter((a) => a.category === 'addon').length > 0 && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium">{t('customers.subscriptions.addons')}</Label>
                                {selectedPlan.addons
                                    .filter((a) => a.category === 'addon')
                                    .map((addon) => {
                                        const addonPrice = addon.prices.find((p) => p.interval === selectedInterval);
                                        const checked = addonToggles[addon.productId] ?? false;
                                        const displayName = (addon.metadata?.displayName as string) ?? addon.name;
                                        return (
                                            <label
                                                key={addon.productId}
                                                className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Switch
                                                        checked={checked}
                                                        onCheckedChange={(val) =>
                                                            setAddonToggles((prev) => ({
                                                                ...prev,
                                                                [addon.productId]: val,
                                                            }))
                                                        }
                                                    />
                                                    <span className="text-sm font-medium">{displayName}</span>
                                                </div>
                                                {addonPrice && (
                                                    <span className="text-muted-foreground text-sm">
                                                        +{formatCents(addonPrice.unitAmountInCents)}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                            </div>
                        )}

                        <Separator />

                        {/* Payment Method */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('customers.subscriptions.paymentMethod')}</Label>
                            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHODS.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {t(PAYMENT_METHOD_TRANSLATION_KEYS[method])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Summary */}
                        <div className="bg-muted/30 rounded-lg border p-4">
                            <div className="flex flex-col gap-2">
                                {selectedInterval && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {selectedPlan.metadata?.titleSuffix
                                                ? `${(selectedPlan.metadata.titlePrefix as string) ?? ''} ${selectedPlan.metadata.titleSuffix as string}`.trim()
                                                : selectedPlan.name}
                                        </span>
                                        <span>
                                            {formatCents(
                                                selectedPlan.prices.find((p) => p.interval === selectedInterval)
                                                    ?.unitAmountInCents ?? 0
                                            )}
                                        </span>
                                    </div>
                                )}
                                {selectedPlan.addons
                                    .filter((a) => a.category === 'addon' && addonToggles[a.productId])
                                    .map((addon) => {
                                        const price = addon.prices.find((p) => p.interval === selectedInterval);
                                        return (
                                            <div
                                                key={addon.productId}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {(addon.metadata?.displayName as string) ?? addon.name}
                                                </span>
                                                <span>+{formatCents(price?.unitAmountInCents ?? 0)}</span>
                                            </div>
                                        );
                                    })}
                                <Separator />
                                <div className="flex items-baseline justify-between">
                                    <span className="font-semibold">Total</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-semibold">{formatCents(totalCents)}</span>
                                        {selectedInterval && (
                                            <span className="text-muted-foreground text-xs">
                                                {INTERVAL_SHORT[selectedInterval]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                <DialogFooter>
                    {step === 'plan' ? (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isPending || !selectedInterval}
                                isLoading={isPending}
                            >
                                {t('customers.subscriptions.createSubscription')}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

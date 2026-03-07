import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@maas/core-utils';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, Checkbox } from '@maas/web-components';
import {
    useCreateCheckoutSession,
    AuthenticationError,
    type CheckoutSession,
    buildSubscriptionMetadata,
} from '@maas/core-api';
import { usePublicRoutes } from '@maas/core-routes';
import type { PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore, type AddressFormData } from '../store/pricing-store';
import { PricingSummary } from './pricing-summary';
import { AddressForm, validateAddress } from './address-form';

const SHIPPING_METRO = 'metro';

interface PricingPaiementStepProps {
    plan: PricingPlan;
    isPrefilling?: boolean;
}

export function PricingPaiementStep({ plan, isPrefilling = false }: PricingPaiementStepProps) {
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const autoRenew = usePricingStore((s) => s.autoRenew);
    const deliveryAddress = usePricingStore((s) => s.deliveryAddress);
    const billingAddress = usePricingStore((s) => s.billingAddress);
    const useDifferentBillingAddress = usePricingStore((s) => s.useDifferentBillingAddress);
    const setDeliveryAddress = usePricingStore((s) => s.setDeliveryAddress);
    const setBillingAddress = usePricingStore((s) => s.setBillingAddress);
    const setUseDifferentBillingAddress = usePricingStore((s) => s.setUseDifferentBillingAddress);
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();
    const checkoutMutation = useCreateCheckoutSession();

    // Shipping / country mismatch validation
    const isDigitalPlan = plan.addons.length === 0;
    const shippingAddon = plan.addons.find((a) => a.category === 'shipping');
    const shippingValue = shippingSelections[plan.planId] ?? SHIPPING_METRO;
    const isInternational = shippingAddon ? shippingValue === shippingAddon.productId : false;

    const isShippingMismatch = useMemo(() => {
        if (isDigitalPlan || !deliveryAddress.country) return false;
        const countryUpper = deliveryAddress.country.toUpperCase();
        if (!isInternational && countryUpper !== 'FR') return true;
        if (isInternational && countryUpper === 'FR') return true;
        return false;
    }, [isDigitalPlan, isInternational, deliveryAddress.country]);

    const [errors, setErrors] = useState<{
        deliveryAddress: Partial<Record<keyof AddressFormData, string>>;
        billingAddress: Partial<Record<keyof AddressFormData, string>>;
    }>({
        deliveryAddress: {},
        billingAddress: {},
    });

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
        // Validate address
        const deliveryErrors = validateAddress(deliveryAddress);
        const billingErrors = useDifferentBillingAddress ? validateAddress(billingAddress) : {};

        if (Object.keys(deliveryErrors).length > 0 || Object.keys(billingErrors).length > 0) {
            setErrors({ deliveryAddress: deliveryErrors, billingAddress: billingErrors });
            return;
        }

        setErrors({ deliveryAddress: {}, billingAddress: {} });

        const billingAddr = useDifferentBillingAddress ? billingAddress : deliveryAddress;
        const origin = window.location.origin;

        const metadata = buildSubscriptionMetadata({ oneTimeSubscription: !autoRenew });

        checkoutMutation.mutate(
            {
                priceIds: selectedPriceIds,
                successUrl: `${origin}${publicRoutes.checkoutSuccess}`,
                cancelUrl: `${origin}${publicRoutes.checkoutCancel}`,
                shippingAddress: {
                    firstName: deliveryAddress.firstName,
                    lastName: deliveryAddress.lastName,
                    line1: deliveryAddress.line1,
                    line2: deliveryAddress.line2 || '',
                    city: deliveryAddress.city,
                    postalCode: deliveryAddress.postalCode,
                    country: deliveryAddress.country,
                },
                billingAddress: {
                    firstName: billingAddr.firstName,
                    lastName: billingAddr.lastName,
                    line1: billingAddr.line1,
                    line2: billingAddr.line2 || '',
                    city: billingAddr.city,
                    postalCode: billingAddr.postalCode,
                    country: billingAddr.country,
                },
                ...(Object.keys(metadata).length > 0 && { metadata }),
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Left column — Address */}
                <div className="border-border bg-background rounded-xl border p-6 md:p-8 lg:col-span-3">
                    <div className="mb-6 flex flex-col gap-1">
                        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                            Adresse de livraison
                        </p>
                        <h3 className="font-heading text-foreground text-xl font-semibold">
                            Où souhaitez-vous recevoir votre magazine ?
                        </h3>
                    </div>

                    {isPrefilling ? (
                        <div className="flex flex-col gap-4">
                            <div className="bg-muted h-10 w-full animate-pulse rounded-lg" />
                            <div className="bg-muted h-10 w-full animate-pulse rounded-lg" />
                            <div className="bg-muted h-10 w-full animate-pulse rounded-lg" />
                            <div className="flex gap-4">
                                <div className="bg-muted h-10 w-1/2 animate-pulse rounded-lg" />
                                <div className="bg-muted h-10 w-1/2 animate-pulse rounded-lg" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <AddressForm
                                address={deliveryAddress}
                                onChange={setDeliveryAddress}
                                errors={errors.deliveryAddress}
                            />

                            {/* Shipping / country mismatch alert */}
                            {isShippingMismatch && (
                                <Alert variant="destructive">
                                    <IconAlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        {isInternational
                                            ? "Vous avez sélectionné l'option « Hors Métropole » mais votre adresse est en France métropolitaine. Veuillez modifier votre adresse ou retourner au configurateur pour changer l'option de livraison."
                                            : "Votre adresse est hors de France métropolitaine. Veuillez retourner au configurateur pour sélectionner l'option « Hors Métropole » ou modifier votre adresse."}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Different billing address checkbox */}
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={useDifferentBillingAddress}
                                    onCheckedChange={(checked) => setUseDifferentBillingAddress(checked === true)}
                                />
                                <span className="text-foreground text-sm font-medium">
                                    Adresse de facturation différente
                                </span>
                            </label>

                            {/* Billing Address (conditional) */}
                            {useDifferentBillingAddress && (
                                <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 duration-200">
                                    <h4 className="text-foreground text-base font-semibold">Adresse de facturation</h4>
                                    <AddressForm
                                        address={billingAddress}
                                        onChange={setBillingAddress}
                                        errors={errors.billingAddress}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right column — Summary + Pay button */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                                    Votre commande
                                </p>
                                <h3 className="font-heading text-foreground text-lg font-semibold">{planName}</h3>
                            </div>
                            <button
                                onClick={() => navigate(publicRoutes.pricing)}
                                className="text-text-secondary hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                            >
                                Modifier
                            </button>
                        </div>

                        <PricingSummary plan={plan} hideCheckedAddonToggles>
                            {checkoutMutation.isError && !(checkoutMutation.error instanceof AuthenticationError) && (
                                <p className="text-destructive text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                            )}

                            <button
                                onClick={handlePay}
                                disabled={
                                    checkoutMutation.isPending ||
                                    selectedPriceIds.length === 0 ||
                                    isPrefilling ||
                                    isShippingMismatch
                                }
                                className={cn(
                                    'flex h-12 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                                    isShippingMismatch
                                        ? 'cursor-not-allowed bg-gray-400'
                                        : 'bg-brand-primary hover:bg-brand-primary/90 cursor-pointer',
                                    (checkoutMutation.isPending || isPrefilling) && 'cursor-wait opacity-70'
                                )}
                            >
                                {checkoutMutation.isPending ? 'Redirection...' : 'Confirmer et payer'}
                            </button>
                        </PricingSummary>
                    </div>
                </div>
            </div>
        </div>
    );
}

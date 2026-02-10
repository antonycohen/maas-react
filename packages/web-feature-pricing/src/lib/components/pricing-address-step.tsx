import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { Input, Checkbox } from '@maas/web-components';
import { useCreateCheckoutSession, AuthenticationError, type CheckoutSession } from '@maas/core-api';
import type { PricingPlan } from '../hooks/use-pricing-data';
import { usePricingStore, type AddressFormData } from '../store/pricing-store';

const SHIPPING_METRO = 'metro';

function validateAddress(address: AddressFormData): Partial<Record<keyof AddressFormData, string>> {
    const errors: Partial<Record<keyof AddressFormData, string>> = {};
    if (!address.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!address.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!address.line1.trim()) errors.line1 = "L'adresse est requise";
    if (!address.city.trim()) errors.city = 'La ville est requise';
    if (!address.postalCode.trim()) errors.postalCode = 'Le code postal est requis';
    if (!address.country.trim()) errors.country = 'Le pays est requis';
    return errors;
}

interface AddressFormProps {
    address: AddressFormData;
    onChange: (address: Partial<AddressFormData>) => void;
    errors: Partial<Record<keyof AddressFormData, string>>;
}

function AddressForm({ address, onChange, errors }: AddressFormProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Prénom</label>
                    <Input
                        value={address.firstName}
                        onChange={(e) => onChange({ firstName: e.target.value })}
                        placeholder="Jean"
                        aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <span className="text-destructive text-xs">{errors.firstName}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Nom</label>
                    <Input
                        value={address.lastName}
                        onChange={(e) => onChange({ lastName: e.target.value })}
                        placeholder="Dupont"
                        aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && <span className="text-destructive text-xs">{errors.lastName}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Adresse</label>
                <Input
                    value={address.line1}
                    onChange={(e) => onChange({ line1: e.target.value })}
                    placeholder="123 Rue de la République"
                    aria-invalid={!!errors.line1}
                />
                {errors.line1 && <span className="text-destructive text-xs">{errors.line1}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Complément d'adresse (optionnel)</label>
                <Input
                    value={address.line2}
                    onChange={(e) => onChange({ line2: e.target.value })}
                    placeholder="Appartement, bâtiment, etc."
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Code postal</label>
                    <Input
                        value={address.postalCode}
                        onChange={(e) => onChange({ postalCode: e.target.value })}
                        placeholder="75001"
                        aria-invalid={!!errors.postalCode}
                    />
                    {errors.postalCode && <span className="text-destructive text-xs">{errors.postalCode}</span>}
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-foreground text-sm font-medium">Ville</label>
                    <Input
                        value={address.city}
                        onChange={(e) => onChange({ city: e.target.value })}
                        placeholder="Paris"
                        aria-invalid={!!errors.city}
                    />
                    {errors.city && <span className="text-destructive text-xs">{errors.city}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Pays</label>
                <Input
                    value={address.country}
                    onChange={(e) => onChange({ country: e.target.value })}
                    placeholder="France"
                    aria-invalid={!!errors.country}
                />
                {errors.country && <span className="text-destructive text-xs">{errors.country}</span>}
            </div>
        </div>
    );
}

interface PricingAddressStepProps {
    plan: PricingPlan;
}

export function PricingAddressStep({ plan }: PricingAddressStepProps) {
    const deliveryAddress = usePricingStore((s) => s.deliveryAddress);
    const billingAddress = usePricingStore((s) => s.billingAddress);
    const useDifferentBillingAddress = usePricingStore((s) => s.useDifferentBillingAddress);
    const setDeliveryAddress = usePricingStore((s) => s.setDeliveryAddress);
    const setBillingAddress = usePricingStore((s) => s.setBillingAddress);
    const setUseDifferentBillingAddress = usePricingStore((s) => s.setUseDifferentBillingAddress);
    const selectedInterval = usePricingStore((s) => s.selectedInterval);
    const addonToggles = usePricingStore((s) => s.addonToggles);
    const shippingSelections = usePricingStore((s) => s.shippingSelections);
    const navigate = useNavigate();
    const location = useLocation();
    const checkoutMutation = useCreateCheckoutSession();

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

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            const deliveryErrors = validateAddress(deliveryAddress);
            const billingErrors = useDifferentBillingAddress ? validateAddress(billingAddress) : {};

            if (Object.keys(deliveryErrors).length > 0 || Object.keys(billingErrors).length > 0) {
                setErrors({ deliveryAddress: deliveryErrors, billingAddress: billingErrors });
                return;
            }

            setErrors({ deliveryAddress: {}, billingAddress: {} });

            const origin = window.location.origin;

            checkoutMutation.mutate(
                {
                    priceIds: selectedPriceIds,
                    successUrl: `${origin}/pricing/checkout/success`,
                    cancelUrl: `${origin}/pricing/checkout/cancel`,
                    shippingAddress: deliveryAddress,
                    billingAddress: useDifferentBillingAddress ? billingAddress : undefined,
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
        },
        [
            deliveryAddress,
            billingAddress,
            useDifferentBillingAddress,
            selectedPriceIds,
            checkoutMutation,
            location.pathname,
            location.search,
            navigate,
        ]
    );

    const planName = plan.metadata?.titleSuffix
        ? `${(plan.metadata.titlePrefix as string) ?? 'Tangente'} ${plan.metadata.titleSuffix as string}`
        : plan.name;

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                            Informations de livraison
                        </p>
                        <h3 className="font-heading text-foreground text-xl font-semibold">{planName}</h3>
                    </div>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="text-text-secondary hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                    >
                        Retour
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Delivery Address */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-foreground text-base font-semibold">Adresse de livraison</h4>
                        <AddressForm
                            address={deliveryAddress}
                            onChange={setDeliveryAddress}
                            errors={errors.deliveryAddress}
                        />
                    </div>

                    {/* Different billing address checkbox */}
                    <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                            checked={useDifferentBillingAddress}
                            onCheckedChange={(checked) => setUseDifferentBillingAddress(checked === true)}
                        />
                        <span className="text-foreground text-sm font-medium">Adresse de facturation différente</span>
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

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={checkoutMutation.isPending || selectedPriceIds.length === 0}
                        className={cn(
                            'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                            checkoutMutation.isPending && 'cursor-wait opacity-70'
                        )}
                    >
                        {checkoutMutation.isPending ? 'Redirection...' : 'Confirmer et payer'}
                    </button>
                </form>
            </div>
        </div>
    );
}

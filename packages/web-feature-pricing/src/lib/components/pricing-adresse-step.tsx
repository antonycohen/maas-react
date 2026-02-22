import { useState } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@maas/core-utils';
import { Checkbox } from '@maas/web-components';
import { useUpdateMyCustomer } from '@maas/core-api';
import { usePublicRoutes } from '@maas/core-routes';
import { usePricingStore, type AddressFormData } from '../store/pricing-store';
import { AddressForm, validateAddress } from './address-form';

export function PricingAdresseStep() {
    const deliveryAddress = usePricingStore((s) => s.deliveryAddress);
    const billingAddress = usePricingStore((s) => s.billingAddress);
    const useDifferentBillingAddress = usePricingStore((s) => s.useDifferentBillingAddress);
    const setDeliveryAddress = usePricingStore((s) => s.setDeliveryAddress);
    const setBillingAddress = usePricingStore((s) => s.setBillingAddress);
    const setUseDifferentBillingAddress = usePricingStore((s) => s.setUseDifferentBillingAddress);
    const reset = usePricingStore((s) => s.reset);
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();

    const updateCustomerMutation = useUpdateMyCustomer();

    const [errors, setErrors] = useState<{
        deliveryAddress: Partial<Record<keyof AddressFormData, string>>;
        billingAddress: Partial<Record<keyof AddressFormData, string>>;
    }>({
        deliveryAddress: {},
        billingAddress: {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const deliveryErrors = validateAddress(deliveryAddress);
        const billingErrors = useDifferentBillingAddress ? validateAddress(billingAddress) : {};

        if (Object.keys(deliveryErrors).length > 0 || Object.keys(billingErrors).length > 0) {
            setErrors({ deliveryAddress: deliveryErrors, billingAddress: billingErrors });
            return;
        }

        setErrors({ deliveryAddress: {}, billingAddress: {} });

        const billingAddr = useDifferentBillingAddress ? billingAddress : deliveryAddress;

        updateCustomerMutation.mutate(
            {
                shippingAddress: {
                    firstName: deliveryAddress.firstName,
                    lastName: deliveryAddress.lastName,
                    line1: deliveryAddress.line1,
                    line2: deliveryAddress.line2 || undefined,
                    city: deliveryAddress.city,
                    postalCode: deliveryAddress.postalCode,
                    country: deliveryAddress.country,
                },
                billingAddress: {
                    name: billingAddr.firstName + ' ' + billingAddr.lastName,
                    line1: billingAddr.line1,
                    line2: billingAddr.line2 || undefined,
                    city: billingAddr.city,
                    postalCode: billingAddr.postalCode,
                    country: billingAddr.country,
                },
            },
            {
                onSuccess: () => {
                    reset();
                    navigate(publicRoutes.checkoutSuccess);
                },
            }
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background rounded-xl border p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-1">
                    <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                        Adresse de livraison
                    </p>
                    <h3 className="font-heading text-foreground text-xl font-semibold">
                        Où souhaitez-vous recevoir votre magazine ?
                    </h3>
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

                    {updateCustomerMutation.isError && (
                        <p className="text-destructive text-sm">
                            Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={updateCustomerMutation.isPending}
                        className={cn(
                            'bg-brand-primary hover:bg-brand-primary/90 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors',
                            updateCustomerMutation.isPending && 'cursor-wait opacity-70'
                        )}
                    >
                        {updateCustomerMutation.isPending ? 'Enregistrement...' : 'Enregistrer mon adresse'}
                    </button>
                </form>
            </div>
        </div>
    );
}

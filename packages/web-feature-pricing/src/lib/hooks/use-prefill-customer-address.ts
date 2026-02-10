import { useEffect, useRef } from 'react';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useGetMyCustomer } from '@maas/core-api';
import { usePricingStore, DEFAULT_ADDRESS, type AddressFormData } from '../store/pricing-store';

export function usePrefillCustomerAddress() {
    const accessToken = useOAuthStore((s) => s.accessToken);
    const setDeliveryAddress = usePricingStore((s) => s.setDeliveryAddress);
    const setBillingAddress = usePricingStore((s) => s.setBillingAddress);
    const deliveryAddress = usePricingStore((s) => s.deliveryAddress);
    const billingAddress = usePricingStore((s) => s.billingAddress);

    const hasPrefilled = useRef(false);

    const {
        data: customer,
        isLoading,
        isError,
    } = useGetMyCustomer(
        {
            id: null,
            name: null,
            email: null,
            metadata: null,
            addressCity: null,
            addressCountry: null,
            addressLine1: null,
            addressLine2: null,
            addressPostalCode: null,
            user: {
                fields: {
                    firstName: null,
                    lastName: null,
                },
            },
        },
        {
            enabled: !!accessToken,
            retry: false,
        }
    );

    // On error (404, etc.), reset addresses to blank and stop retrying
    useEffect(() => {
        if (isError && !hasPrefilled.current) {
            setDeliveryAddress(DEFAULT_ADDRESS);
            setBillingAddress(DEFAULT_ADDRESS);
            hasPrefilled.current = true;
        }
    }, [isError, setDeliveryAddress, setBillingAddress]);

    useEffect(() => {
        if (hasPrefilled.current) return;
        if (!customer) return;

        // Customer address_* fields = billing
        const nameParts = customer.name?.split(' ') ?? [];
        const customerBilling: AddressFormData = {
            firstName: customer.user?.firstName ?? nameParts[0] ?? '',
            lastName: customer.user?.lastName ?? nameParts.slice(1).join(' ') ?? '',
            line1: customer.addressLine1 ?? '',
            line2: customer.addressLine2 ?? '',
            city: customer.addressCity ?? '',
            postalCode: customer.addressPostalCode ?? '',
            country: customer.addressCountry ?? 'FR',
        };

        // metadata.delivery_address = delivery
        const metaDelivery = customer.metadata?.deliveryAddress as Partial<AddressFormData> | undefined;
        const customerDelivery: AddressFormData | null = metaDelivery?.line1
            ? {
                  firstName: metaDelivery.firstName ?? customerBilling.firstName,
                  lastName: metaDelivery.lastName ?? customerBilling.lastName,
                  line1: metaDelivery.line1 ?? '',
                  line2: metaDelivery.line2 ?? '',
                  city: metaDelivery.city ?? '',
                  postalCode: metaDelivery.postalCode ?? '',
                  country: metaDelivery.country ?? 'FR',
              }
            : null;

        const hasBilling = !!customer.addressLine1;
        const hasDelivery = !!customerDelivery;

        // Prefill delivery: use metadata delivery, fallback to billing
        if (hasDelivery) {
            setDeliveryAddress(customerDelivery);
        } else if (hasBilling) {
            setDeliveryAddress(customerBilling);
        }

        // Prefill billing: use customer address fields, fallback to delivery
        if (hasBilling) {
            setBillingAddress(customerBilling);
        } else if (hasDelivery) {
            setBillingAddress(customerDelivery);
        }

        hasPrefilled.current = true;
         
    }, [isError, customer, deliveryAddress, billingAddress]);

    return { customer, isLoading: isLoading && !!accessToken, isError };
}

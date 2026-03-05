import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useGetMyCustomer, useGetCheckoutSessionAddress } from '@maas/core-api';
import { usePricingStore, DEFAULT_ADDRESS, type AddressFormData } from '../store/pricing-store';

export function usePrefillCustomerAddress() {
    const accessToken = useOAuthStore((s) => s.accessToken);
    const setDeliveryAddress = usePricingStore((s) => s.setDeliveryAddress);
    const setBillingAddress = usePricingStore((s) => s.setBillingAddress);

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const hasPrefilled = useRef(false);

    // Fetch address from the Stripe checkout session (preferred source)
    const { data: sessionAddress, isError: isSessionError } = useGetCheckoutSessionAddress(sessionId, {
        enabled: !!sessionId && !!accessToken,
    });

    // Fallback: fetch from stored customer data
    const {
        data: customer,
        isLoading,
        isError: isCustomerError,
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

    const isError = isCustomerError && (!sessionId || isSessionError);

    // On error (404, etc.), reset addresses to blank and stop retrying
    useEffect(() => {
        if (isError && !hasPrefilled.current) {
            setDeliveryAddress(DEFAULT_ADDRESS);
            setBillingAddress(DEFAULT_ADDRESS);
            hasPrefilled.current = true;
        }
    }, [isError, setDeliveryAddress, setBillingAddress]);

    // Prefill from checkout session address (no country)
    useEffect(() => {
        if (hasPrefilled.current) return;
        if (!sessionAddress) return;

        const addr = sessionAddress.address;
        const sessionAddr: Partial<AddressFormData> = {
            firstName: addr.firstName ?? '',
            lastName: addr.lastName ?? '',
            line1: addr.line1 ?? '',
            line2: addr.line2 ?? '',
            city: addr.city ?? '',
            postalCode: addr.postalCode ?? '',
        };

        setDeliveryAddress(sessionAddr);
        setBillingAddress(sessionAddr);
        hasPrefilled.current = true;
    }, [sessionAddress, setDeliveryAddress, setBillingAddress]);

    // Fallback: prefill from customer data (only if session address didn't fill)
    useEffect(() => {
        if (hasPrefilled.current) return;
        if (sessionId && !isSessionError) return; // still waiting for session address
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
        } else {
            setDeliveryAddress(DEFAULT_ADDRESS);
        }

        // Prefill billing: use customer address fields, fallback to delivery
        if (hasBilling) {
            setBillingAddress(customerBilling);
        } else if (hasDelivery) {
            setBillingAddress(customerDelivery);
        } else {
            setBillingAddress(DEFAULT_ADDRESS);
        }

        hasPrefilled.current = true;
    }, [sessionId, isSessionError, customer, setDeliveryAddress, setBillingAddress]);

    // Derive loading state from data/query states only (no ref access during render)
    const hasData = !!sessionAddress || !!customer || isError;
    const isPrefilling = !!accessToken && !hasData && ((!!sessionId && !isSessionError) || (!sessionId && isLoading));

    return { customer, isLoading: isPrefilling, isError };
}

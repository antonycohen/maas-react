import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BillingInterval } from '../hooks/use-pricing-data';

export type PricingStep = 'plan' | 'configure' | 'auth' | 'address';

export interface AddressFormData {
    firstName: string;
    lastName: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
}

export const DEFAULT_ADDRESS: AddressFormData = {
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'FR',
};

export interface PricingState {
    currentStep: PricingStep;
    selectedInterval: BillingInterval | null;
    selectedPlanId: string | null;
    addonToggles: Record<string, boolean>;
    shippingSelections: Record<string, string>;
    deliveryAddress: AddressFormData;
    billingAddress: AddressFormData;
    useDifferentBillingAddress: boolean;
}

export interface PricingActions {
    setCurrentStep: (step: PricingStep) => void;
    setSelectedInterval: (interval: BillingInterval | null) => void;
    setSelectedPlanId: (planId: string | null) => void;
    toggleAddon: (productId: string, checked: boolean) => void;
    setShipping: (planId: string, value: string) => void;
    setDeliveryAddress: (address: Partial<AddressFormData>) => void;
    setBillingAddress: (address: Partial<AddressFormData>) => void;
    setUseDifferentBillingAddress: (value: boolean) => void;
    reset: () => void;
}

const defaultState: PricingState = {
    currentStep: 'plan',
    selectedInterval: null,
    selectedPlanId: null,
    addonToggles: {},
    shippingSelections: {},
    deliveryAddress: DEFAULT_ADDRESS,
    billingAddress: DEFAULT_ADDRESS,
    useDifferentBillingAddress: false,
};

export const usePricingStore = create<PricingState & PricingActions>()(
    persist(
        (set) => ({
            ...defaultState,
            setCurrentStep: (currentStep) => set({ currentStep }),
            setSelectedInterval: (selectedInterval) => set({ selectedInterval }),
            setSelectedPlanId: (selectedPlanId) => set({ selectedPlanId }),
            toggleAddon: (productId, checked) =>
                set((state) => ({
                    addonToggles: { ...state.addonToggles, [productId]: checked },
                })),
            setShipping: (planId, value) =>
                set((state) => ({
                    shippingSelections: { ...state.shippingSelections, [planId]: value },
                })),
            setDeliveryAddress: (address) =>
                set((state) => ({
                    deliveryAddress: { ...state.deliveryAddress, ...address },
                })),
            setBillingAddress: (address) =>
                set((state) => ({
                    billingAddress: { ...state.billingAddress, ...address },
                })),
            setUseDifferentBillingAddress: (useDifferentBillingAddress) => set({ useDifferentBillingAddress }),
            reset: () => set(defaultState),
        }),
        {
            name: 'pricing-selections',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

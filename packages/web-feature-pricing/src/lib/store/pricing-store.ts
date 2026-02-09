import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BillingInterval } from '../hooks/use-pricing-data';

export interface PricingState {
    selectedInterval: BillingInterval;
    selectedPlanId: string | null;
    addonToggles: Record<string, boolean>;
    shippingSelections: Record<string, string>;
}

export interface PricingActions {
    setSelectedInterval: (interval: BillingInterval) => void;
    setSelectedPlanId: (planId: string | null) => void;
    toggleAddon: (productId: string, checked: boolean) => void;
    setShipping: (planId: string, value: string) => void;
    reset: () => void;
}

const defaultState: PricingState = {
    selectedInterval: 'annual',
    selectedPlanId: null,
    addonToggles: {},
    shippingSelections: {},
};

export const usePricingStore = create<PricingState & PricingActions>()(
    persist(
        (set) => ({
            ...defaultState,
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
            reset: () => set(defaultState),
        }),
        {
            name: 'pricing-selections',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

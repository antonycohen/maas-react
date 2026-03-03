import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { NotFoundPage } from '@maas/web-components';

const PricingPage = lazy(() => import('../pages/pricing-page/pricing-page').then((m) => ({ default: m.PricingPage })));
const PricingAuthPage = lazy(() =>
    import('../pages/pricing-auth-page/pricing-auth-page').then((m) => ({
        default: m.PricingAuthPage,
    }))
);
const PricingPaiementPage = lazy(() =>
    import('../pages/pricing-paiement-page/pricing-paiement-page').then((m) => ({
        default: m.PricingPaiementPage,
    }))
);
const PricingAdressePage = lazy(() =>
    import('../pages/pricing-adresse-page/pricing-adresse-page').then((m) => ({
        default: m.PricingAdressePage,
    }))
);
const CheckoutSuccessPage = lazy(() =>
    import('../pages/checkout-success-page/checkout-success-page').then((m) => ({
        default: m.CheckoutSuccessPage,
    }))
);
const CheckoutCancelPage = lazy(() =>
    import('../pages/checkout-cancel-page/checkout-cancel-page').then((m) => ({
        default: m.CheckoutCancelPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export function PricingRoutes() {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route index element={<PricingPage />} />
                <Route path="auth" element={<PricingAuthPage />} />
                <Route path="paiement" element={<PricingPaiementPage />} />
                <Route path="adresse" element={<PricingAdressePage />} />
                <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}

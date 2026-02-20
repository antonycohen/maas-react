import { Route, Routes } from 'react-router-dom';
import { NotFoundPage } from '@maas/web-components';
import { PricingPage } from '../pages/pricing-page/pricing-page';
import { PricingAuthPage } from '../pages/pricing-auth-page/pricing-auth-page';
import { PricingPaiementPage } from '../pages/pricing-paiement-page/pricing-paiement-page';
import { PricingAdressePage } from '../pages/pricing-adresse-page/pricing-adresse-page';
import { CheckoutSuccessPage } from '../pages/checkout-success-page/checkout-success-page';
import { CheckoutCancelPage } from '../pages/checkout-cancel-page/checkout-cancel-page';

export function PricingRoutes() {
    return (
        <Routes>
            <Route index element={<PricingPage />} />
            <Route path="auth" element={<PricingAuthPage />} />
            <Route path="paiement" element={<PricingPaiementPage />} />
            <Route path="adresse" element={<PricingAdressePage />} />
            <Route path="checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

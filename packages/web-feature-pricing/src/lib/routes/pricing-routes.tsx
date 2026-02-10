import { Route, Routes } from 'react-router-dom';
import { PricingPage } from '../pages/pricing-page/pricing-page';
import { PricingAuthPage } from '../pages/pricing-auth-page/pricing-auth-page';
import { PricingInformationsPage } from '../pages/pricing-informations-page/pricing-informations-page';
import { CheckoutSuccessPage } from '../pages/checkout-success-page/checkout-success-page';
import { CheckoutCancelPage } from '../pages/checkout-cancel-page/checkout-cancel-page';

export function PricingRoutes() {
    return (
        <Routes>
            <Route index element={<PricingPage />} />
            <Route path="auth" element={<PricingAuthPage />} />
            <Route path="informations" element={<PricingInformationsPage />} />
            <Route path="checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
        </Routes>
    );
}

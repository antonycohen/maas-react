import { Route, Routes } from 'react-router-dom';
import { PricingPage } from '../pages/pricing-page/pricing-page';

export function PricingRoutes() {
  return (
    <Routes>
      <Route index element={<PricingPage />} />
    </Routes>
  );
}

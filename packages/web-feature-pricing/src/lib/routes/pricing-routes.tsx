import { Route, Routes } from 'react-router-dom';
import { PricingListingPage } from '../pages/pricing-listing-page';

export function PricingRoutes() {
  return (
    <Routes>
      <Route index element={<PricingListingPage />} />
    </Routes>
  );
}

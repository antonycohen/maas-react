import { Route, Routes } from 'react-router-dom';
import { BrandsListManagerPage } from '../pages/brands/list-brands-manager-page';
import { EditBrandManagerPage } from '../pages/brands/edit-brand-manager-page';

export const BrandsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BrandsListManagerPage />} />
      <Route path="/:brandId" element={<EditBrandManagerPage />} />
    </Routes>
  );
};

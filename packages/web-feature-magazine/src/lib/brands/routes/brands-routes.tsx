import { Route, Routes } from 'react-router-dom';
import { BrandsListManagerPage } from '../pages/list-brands-manager-page';
import { EditBrandManagerPage } from '../pages/edit-brand-manager-page';

export const BrandsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BrandsListManagerPage />} />
      <Route path="/:brandId" element={<EditBrandManagerPage />} />
    </Routes>
  );
};

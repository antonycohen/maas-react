import { Route, Routes } from 'react-router-dom';
import { CategoriesListManagerPage } from '../pages/list-categories-manager-page';
import { EditCategoryManagerPage } from '../pages/edit-category-manager-page';

export const CategoriesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoriesListManagerPage />} />
      <Route path="/:categoryId" element={<EditCategoryManagerPage />} />
    </Routes>
  );
};

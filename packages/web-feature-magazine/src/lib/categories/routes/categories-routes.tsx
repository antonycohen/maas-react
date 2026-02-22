import { Route, Routes } from 'react-router';
import { CategoriesListManagerPage } from '../pages/list-categories-manager-page/categories-list-manager-page';
import { EditCategoryManagerPage } from '../pages/edit-category-manager-page/edit-category-manager-page';

export const CategoriesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CategoriesListManagerPage />} />
            <Route path="/:categoryId" element={<EditCategoryManagerPage />} />
        </Routes>
    );
};

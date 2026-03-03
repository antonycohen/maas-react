import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const CategoriesListManagerPage = lazy(() =>
    import('../pages/list-categories-manager-page/categories-list-manager-page').then((m) => ({
        default: m.CategoriesListManagerPage,
    }))
);
const EditCategoryManagerPage = lazy(() =>
    import('../pages/edit-category-manager-page/edit-category-manager-page').then((m) => ({
        default: m.EditCategoryManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const CategoriesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<CategoriesListManagerPage />} />
                <Route path="/:categoryId" element={<EditCategoryManagerPage />} />
            </Routes>
        </Suspense>
    );
};

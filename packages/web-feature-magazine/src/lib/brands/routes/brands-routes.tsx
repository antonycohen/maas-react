import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const BrandsListManagerPage = lazy(() =>
    import('../pages/list-brands-manager-page').then((m) => ({
        default: m.BrandsListManagerPage,
    }))
);
const EditBrandManagerPage = lazy(() =>
    import('../pages/edit-brand-manager-page').then((m) => ({
        default: m.EditBrandManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const BrandsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<BrandsListManagerPage />} />
                <Route path="/:brandId" element={<EditBrandManagerPage />} />
            </Routes>
        </Suspense>
    );
};

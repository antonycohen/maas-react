import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const PricesListManagerPage = lazy(() =>
    import('../pages/list-prices-manager-page/prices-list-manager-page').then((m) => ({
        default: m.PricesListManagerPage,
    }))
);
const EditPriceManagerPage = lazy(() =>
    import('../pages/edit-price-manager-page/edit-price-manager-page').then((m) => ({
        default: m.EditPriceManagerPage,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const PricesRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<PricesListManagerPage />} />
                <Route path=":priceId" element={<EditPriceManagerPage />} />
            </Routes>
        </Suspense>
    );
};

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const ProductsListManagerPage = lazy(() =>
    import('../pages/list-products-manager-page/products-list-manager-page').then((m) => ({
        default: m.ProductsListManagerPage,
    }))
);
const EditProductManagerPage = lazy(() =>
    import('../pages/edit-product-manager-page/edit-product-manager-page').then((m) => ({
        default: m.EditProductManagerPage,
    }))
);
const ProductInfoTab = lazy(() =>
    import('../pages/edit-product-manager-page/tabs/product-info-tab').then((m) => ({
        default: m.ProductInfoTab,
    }))
);
const ProductPricesTab = lazy(() =>
    import('../pages/edit-product-manager-page/tabs/product-prices-tab').then((m) => ({
        default: m.ProductPricesTab,
    }))
);
const ProductFeaturesTab = lazy(() =>
    import('../pages/edit-product-manager-page/tabs/product-features-tab').then((m) => ({
        default: m.ProductFeaturesTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const ProductsRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<ProductsListManagerPage />} />
                <Route path=":productId" element={<EditProductManagerPage />}>
                    <Route path="info" element={<ProductInfoTab />} />
                    <Route path="prices" element={<ProductPricesTab />} />
                    <Route path="features" element={<ProductFeaturesTab />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

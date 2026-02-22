import { Route, Routes } from 'react-router';
import { ProductsListManagerPage } from '../pages/list-products-manager-page/products-list-manager-page';
import { EditProductManagerPage } from '../pages/edit-product-manager-page/edit-product-manager-page';
import { ProductInfoTab } from '../pages/edit-product-manager-page/tabs/product-info-tab';
import { ProductPricesTab } from '../pages/edit-product-manager-page/tabs/product-prices-tab';
import { ProductFeaturesTab } from '../pages/edit-product-manager-page/tabs/product-features-tab';

export const ProductsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductsListManagerPage />} />
            <Route path=":productId" element={<EditProductManagerPage />}>
                <Route path="info" element={<ProductInfoTab />} />
                <Route path="prices" element={<ProductPricesTab />} />
                <Route path="features" element={<ProductFeaturesTab />} />
            </Route>
        </Routes>
    );
};

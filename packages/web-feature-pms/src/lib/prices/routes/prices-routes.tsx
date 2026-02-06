import { Route, Routes } from 'react-router-dom';
import { PricesListManagerPage } from '../pages/list-prices-manager-page/prices-list-manager-page';
import { EditPriceManagerPage } from '../pages/edit-price-manager-page/edit-price-manager-page';

export const PricesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PricesListManagerPage />} />
            <Route path=":priceId" element={<EditPriceManagerPage />} />
        </Routes>
    );
};

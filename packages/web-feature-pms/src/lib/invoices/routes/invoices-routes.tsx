import { Route, Routes } from 'react-router';
import { InvoicesListManagerPage } from '../pages/list-invoices-manager-page/invoices-list-manager-page';

export const InvoicesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InvoicesListManagerPage />} />
        </Routes>
    );
};

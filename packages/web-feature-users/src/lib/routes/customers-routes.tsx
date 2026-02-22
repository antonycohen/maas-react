import { Navigate, Route, Routes } from 'react-router';
import { CustomersListManagerPage } from '../pages/list-customers-manager-page/customers-list-manager-page';
import { EditCustomerManagerPage } from '../pages/edit-customer-manager-page/edit-customer-manager-page';
import { CustomerInfoTab } from '../pages/edit-customer-manager-page/tabs/customer-info-tab';
import { CustomerSubscriptionsTab } from '../pages/edit-customer-manager-page/tabs/customer-subscriptions-tab';

export const CustomersRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersListManagerPage />} />
            <Route path=":customerId" element={<EditCustomerManagerPage />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<CustomerInfoTab />} />
                <Route path="subscriptions" element={<CustomerSubscriptionsTab />} />
            </Route>
        </Routes>
    );
};

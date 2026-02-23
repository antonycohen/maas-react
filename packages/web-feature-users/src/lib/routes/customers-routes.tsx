import { Navigate, Route, Routes } from 'react-router';
import { CustomersListManagerPage } from '../pages/list-customers-manager-page/customers-list-manager-page';
import { EditCustomerManagerPage } from '../pages/edit-customer-manager-page/edit-customer-manager-page';
import { CustomerInfoTab } from '../pages/edit-customer-manager-page/tabs/customer-info-tab';
import { CustomerAddressesTab } from '../pages/edit-customer-manager-page/tabs/customer-addresses-tab';
import { CustomerSubscriptionsTab } from '../pages/edit-customer-manager-page/tabs/customer-subscriptions-tab';

export const CustomersRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersListManagerPage />} />
            <Route path=":customerId" element={<EditCustomerManagerPage />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<CustomerInfoTab />} />
                <Route path="addresses" element={<CustomerAddressesTab />} />
                <Route path="subscriptions" element={<CustomerSubscriptionsTab />} />
            </Route>
        </Routes>
    );
};

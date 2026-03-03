import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const CustomersListManagerPage = lazy(() =>
    import('../pages/list-customers-manager-page/customers-list-manager-page').then((m) => ({
        default: m.CustomersListManagerPage,
    }))
);
const EditCustomerManagerPage = lazy(() =>
    import('../pages/edit-customer-manager-page/edit-customer-manager-page').then((m) => ({
        default: m.EditCustomerManagerPage,
    }))
);
const CustomerInfoTab = lazy(() =>
    import('../pages/edit-customer-manager-page/tabs/customer-info-tab').then((m) => ({
        default: m.CustomerInfoTab,
    }))
);
const CustomerAddressesTab = lazy(() =>
    import('../pages/edit-customer-manager-page/tabs/customer-addresses-tab').then((m) => ({
        default: m.CustomerAddressesTab,
    }))
);
const CustomerSubscriptionsTab = lazy(() =>
    import('../pages/edit-customer-manager-page/tabs/customer-subscriptions-tab').then((m) => ({
        default: m.CustomerSubscriptionsTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const CustomersRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<CustomersListManagerPage />} />
                <Route path=":customerId" element={<EditCustomerManagerPage />}>
                    <Route index element={<Navigate to="info" replace />} />
                    <Route path="info" element={<CustomerInfoTab />} />
                    <Route path="addresses" element={<CustomerAddressesTab />} />
                    <Route path="subscriptions" element={<CustomerSubscriptionsTab />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

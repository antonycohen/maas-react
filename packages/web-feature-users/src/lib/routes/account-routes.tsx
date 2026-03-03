import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const AccountSettingsPage = lazy(() =>
    import('../pages/account-settings-page/account-settings-page').then((m) => ({
        default: m.AccountSettingsPage,
    }))
);
const AccountProfileTab = lazy(() =>
    import('../pages/account-settings-page/tabs/account-profile-tab/account-profile-tab').then((m) => ({
        default: m.AccountProfileTab,
    }))
);
const AccountConnexionTab = lazy(() =>
    import('../pages/account-settings-page/tabs/account-connexion-tab/account-connexion-tab').then((m) => ({
        default: m.AccountConnexionTab,
    }))
);
const AccountSubscriptionTab = lazy(() =>
    import('../pages/account-settings-page/tabs/account-subscription-tab/account-subscription-tab').then((m) => ({
        default: m.AccountSubscriptionTab,
    }))
);
const AccountInvoicesTab = lazy(() =>
    import('../pages/account-settings-page/tabs/account-invoices-tab/account-invoices-tab').then((m) => ({
        default: m.AccountInvoicesTab,
    }))
);
const AccountAddressesTab = lazy(() =>
    import('../pages/account-settings-page/tabs/account-addresses-tab/account-addresses-tab').then((m) => ({
        default: m.AccountAddressesTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const AccountRoutes = ({ baseUrl = '' }: { baseUrl?: string }) => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route element={<AccountSettingsPage baseUrl={baseUrl} />}>
                    <Route path="profile" element={<AccountProfileTab />} />
                    <Route path="connexion" element={<AccountConnexionTab />} />
                    {/* <Route path="preferences" element={<AccountPreferencesTab />} /> */}
                    <Route path="addresses" element={<AccountAddressesTab />} />
                    <Route path="subscription" element={<AccountSubscriptionTab />} />
                    <Route path="invoices" element={<AccountInvoicesTab />} />
                    <Route path="*" element={<Navigate to="profile" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

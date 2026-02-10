import { Navigate, Route, Routes } from 'react-router-dom';
import { AccountSettingsPage } from '../pages/account-settings-page/account-settings-page';
import { AccountProfileTab } from '../pages/account-settings-page/tabs/account-profile-tab/account-profile-tab';
import { AccountConnexionTab } from '../pages/account-settings-page/tabs/account-connexion-tab/account-connexion-tab';
import { AccountPreferencesTab } from '../pages/account-settings-page/tabs/account-preferences-tab/account-preferences-tab';
import { AccountSubscriptionTab } from '../pages/account-settings-page/tabs/account-subscription-tab/account-subscription-tab';

export const AccountRoutes = ({ baseUrl = '' }: { baseUrl?: string }) => {
    return (
        <Routes>
            <Route element={<AccountSettingsPage baseUrl={baseUrl} />}>
                <Route path="/profile" element={<AccountProfileTab />} />
                <Route path="/connexion" element={<AccountConnexionTab />} />
                <Route path="/preferences" element={<AccountPreferencesTab />} />
                <Route path="/subscription" element={<AccountSubscriptionTab />} />
                <Route path="*" element={<Navigate to="profile" replace />} />
            </Route>
        </Routes>
    );
};

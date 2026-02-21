import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login-page/login-page';
import { OauthCallbackPage } from '../pages/oauth-callback-page/oauth-callback-page';
import { DispatcherPage } from '../pages/dipatcher-page/dispatcher-page';
import { PUBLIC_ROUTES } from '@maas/core-routes';

export const LoginRoutes = () => {
    return (
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path="callback" element={<OauthCallbackPage />} />
            <Route path="dispatcher" element={<DispatcherPage />} />
            <Route path="*" element={<Navigate to={PUBLIC_ROUTES.LOGIN} replace />} />
        </Routes>
    );
};

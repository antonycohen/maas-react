import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginRoutes, LogoutPage } from '@maas/web-feature-login';
import { AdminRoutes } from './admin-routes';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { Layout } from '@maas/web-layout';
import { CategoryPage, FolderRoutes, HomePage, ArticlesRoutes, MagazinesRoutes } from '@maas/web-feature-home';
import { PricingRoutes } from '@maas/web-feature-pricing';
import { useAutoScrollTop } from '../hooks/use-auto-scroll-top';

const AccountRoutes = lazy(() => import('@maas/web-feature-users').then((m) => ({ default: m.AccountRoutes })));

export const RootRoutes = () => {
    useAutoScrollTop();
    const connectedUser = useConnectedUser();

    return (
        <Routes>
            <Route path="/login/*" element={<LoginRoutes />} />
            <Route path="/logout/*" element={<LogoutPage />} />
            <Route path="/admin/*" element={<ProtectedPage />}>
                <Route path="*" element={<AdminRoutes />} />
            </Route>
            <Route element={<Layout connectedUser={connectedUser} />}>
                <Route index element={<HomePage />} />
                <Route path="magazines/*" element={<MagazinesRoutes />} />
                <Route path="dossiers/*" element={<FolderRoutes />} />
                <Route path="categories/:slug" element={<CategoryPage />} />
                <Route path="articles/*" element={<ArticlesRoutes />} />
                <Route path={'pricing/*'} element={<PricingRoutes />} />
                <Route path="account/*" element={<ProtectedPage />}>
                    <Route path="*" element={<AccountRoutes />} />
                </Route>
            </Route>
        </Routes>
    );
};

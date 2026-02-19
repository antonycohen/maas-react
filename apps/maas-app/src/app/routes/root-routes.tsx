import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './admin-routes';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { Layout } from '@maas/web-layout';
import { useAutoScrollTop } from '../hooks/use-auto-scroll-top';

// Lazy-loaded public feature routes for code splitting
const LoginRoutes = lazy(() => import('@maas/web-feature-login').then((m) => ({ default: m.LoginRoutes })));
const LogoutPage = lazy(() => import('@maas/web-feature-login').then((m) => ({ default: m.LogoutPage })));
const HomePage = lazy(() => import('@maas/web-feature-home').then((m) => ({ default: m.HomePage })));
const MagazinesRoutes = lazy(() => import('@maas/web-feature-home').then((m) => ({ default: m.MagazinesRoutes })));
const FolderRoutes = lazy(() => import('@maas/web-feature-home').then((m) => ({ default: m.FolderRoutes })));
const ArticlesRoutes = lazy(() => import('@maas/web-feature-home').then((m) => ({ default: m.ArticlesRoutes })));
const CategoryPage = lazy(() => import('@maas/web-feature-home').then((m) => ({ default: m.CategoryPage })));
const PricingRoutes = lazy(() => import('@maas/web-feature-pricing').then((m) => ({ default: m.PricingRoutes })));
const AccountRoutes = lazy(() => import('@maas/web-feature-users').then((m) => ({ default: m.AccountRoutes })));

export const RootRoutes = () => {
    useAutoScrollTop();
    const connectedUser = useConnectedUser();

    return (
        <Suspense>
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
        </Suspense>
    );
};

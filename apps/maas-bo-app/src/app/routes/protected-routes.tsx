import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { AdminLayout } from '@maas/web-layout';
import { SettingsRoutes } from '@maas/web-feature-settings';
import { AccountRoutes, UsersRoutes } from '@maas/web-feature-users';
import { HomeRoutes } from '@maas/web-feature-home';
import { TeamsRoutes } from '@maas/web-feature-organizations';
import {
  ArticlesRoutes,
  BrandsRoutes,
  CategoriesRoutes,
  FoldersRoutes,
  IssuesRoutes,
} from '@maas/web-feature-magazine';
import { mainNavigation } from '../navigation/main-navigation';
import { accountNavigation } from '../navigation/account-navigation';

export const ProtectedRoutes = () => {
  const connectedUser = useConnectedUser();

  return (
    <Routes>
      <Route path="*" element={<ProtectedPage />}>
        {connectedUser && (
          <Route
            element={
              <AdminLayout
                connectedUser={connectedUser}
                mainNavigationGroups={mainNavigation}
                navUserItems={accountNavigation}
              />
            }
          >
            <Route path="account/*" element={<AccountRoutes baseUrl={''} />} />
            <Route path="issues/*" element={<IssuesRoutes />} />
            <Route path="articles/*" element={<ArticlesRoutes />} />
            <Route path="categories/*" element={<CategoriesRoutes />} />
            <Route path="folders/*" element={<FoldersRoutes />} />
            <Route path="brands/*" element={<BrandsRoutes />} />
            <Route path="users/*" element={<UsersRoutes />} />
            <Route path="teams/*" element={<TeamsRoutes />} />
            <Route path="settings/*" element={<SettingsRoutes />} />
            <Route index element={<HomeRoutes />} />
            <Route path="*" element={<Navigate to={'/'} />} />
          </Route>
        )}
      </Route>
    </Routes>
  );
};

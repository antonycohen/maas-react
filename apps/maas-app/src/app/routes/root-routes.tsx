import { Route, Routes } from 'react-router-dom';
import { LoginRoutes } from '@maas/web-feature-login';
import { AdminRoutes } from './admin-routes';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { Layout } from '@maas/web-layout';
import { HomePage } from '@maas/web-feature-home';
import { AccountRoutes } from '@maas/web-feature-users';

export const RootRoutes = () => {
  const connectedUser = useConnectedUser();

  return (
    <Routes>
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/admin/*" element={<ProtectedPage />}>
        <Route path="*" element={<AdminRoutes />} />
      </Route>
      <Route element={<Layout connectedUser={connectedUser} />}>
        <Route index element={<HomePage />} />
        <Route path="categories/*" element={<HomePage />} />

        <Route path="account/*" element={<ProtectedPage />}>
          <Route path="*" element={<AccountRoutes />} />
        </Route>
      </Route>


    </Routes>
  );
};

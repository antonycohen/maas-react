import { Route, Routes } from 'react-router-dom';
import { LoginRoutes } from '@maas/web-feature-login';
import { AdminRoutes } from './admin-routes';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { Layout } from '@maas/web-layout';
import { HomePage, HomeRoutes } from '@maas/web-feature-home';

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
      </Route>
    </Routes>
  );
};

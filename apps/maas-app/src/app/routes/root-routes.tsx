import { Route, Routes } from 'react-router-dom';
import { LoginRoutes } from '@maas/web-feature-login';
import { ProtectedRoutes } from './protected-routes';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { Layout } from '@maas/web-layout';
import { HomeRoutes } from '@maas/web-feature-home';

export const RootRoutes = () => {
  const connectedUser = useConnectedUser();

  return (
    <Routes>
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/accounts/*" element={<ProtectedPage />}>
        <Route path="*" element={<ProtectedRoutes />} />
      </Route>
      <Route element={<Layout connectedUser={connectedUser} />}>
        <Route index element={<HomeRoutes />} />
      </Route>
    </Routes>
  );
};

import { Route, Routes } from 'react-router-dom';
import { LoginRoutes } from '@maas/web-feature-login';
import { ProtectedRoutes } from './protected-routes';
import { ProtectedPage } from '@maas/core-store-session';

export const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="*" element={<ProtectedPage />}>
        <Route path="*" element={<ProtectedRoutes />} />
      </Route>
    </Routes>
  );
};

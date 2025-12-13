import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { AdminLayout } from '@maas/web-layout';
import { SettingsRoutes } from '@maas/web-feature-settings';
import { UsersRoutes } from '@maas/web-feature-users';
import { FeedsRoutes } from '@maas/web-feature-feeds';

export const ProtectedRoutes = () => {
  const connectedUser = useConnectedUser();

  return (
    <Routes>
      <Route path="*" element={<ProtectedPage />}>
        {connectedUser && (
          <Route element={<AdminLayout connectedUser={connectedUser} />}>
            <Route path="users/*" element={<UsersRoutes />} />
            <Route path="settings/*" element={<SettingsRoutes />} />
            <Route index element={<FeedsRoutes />} />
            <Route path="*" element={<Navigate to={'/'} />} />
          </Route>
        )}
      </Route>
    </Routes>
  );
};

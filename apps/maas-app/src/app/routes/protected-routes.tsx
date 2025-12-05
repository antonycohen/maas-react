import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedPage, useConnectedUser } from '@maas/core-store-session';
import { AdminLayout } from '@maas/web-layout';
import { SettingsRoutes } from '@maas/web-feature-settings';
import { UsersRoutes } from '@maas/web-feature-users';
import { HomeRoutes } from '@maas/web-feature-home';
import { mainNavigation } from '../navigation/main-navigation';
import { GalleryVerticalEnd } from 'lucide-react';

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
                teams={{
                  teams: [
                    {
                      name: 'Acme Inc',
                      logo: GalleryVerticalEnd,
                      plan: 'Enterprise',
                    },
                  ],
                }}
                navMain={{ sections: [{ items: mainNavigation }]}}
                projects={{
                  projects: [
                    {
                      name: 'Kodd App',
                      icon: GalleryVerticalEnd,
                      url: '/',
                    },
                  ],
                }}
              />
            }
          >
            <Route path="users/*" element={<UsersRoutes />} />
            <Route path="settings/*" element={<SettingsRoutes />} />
            <Route index element={<HomeRoutes />} />
            <Route path="*" element={<Navigate to={'/'} />} />
          </Route>
        )}
      </Route>
    </Routes>
  );
};

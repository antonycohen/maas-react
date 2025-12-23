import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AdminLayout } from '@maas/web-layout';
import { useConnectedUser } from '@maas/core-store-session';
import { useGetUserOrganizations } from '@maas/core-api';
import { User } from '@maas/core-api-models';
import { AccountRoutes, UsersRoutes } from '@maas/web-feature-users';
import { WorkspaceProvider } from '@maas/core-workspace';
import {
  ArticlesRoutes,
  BrandsRoutes,
  CategoriesRoutes,
  FoldersRoutes,
  IssuesRoutes,
} from '@maas/web-feature-magazine';
import { TeamsRoutes } from '@maas/web-feature-organizations';
import { SettingsRoutes } from '@maas/web-feature-settings';
import { useMainNavigation } from '../hooks/use-main-navigation';
import { useUserNavigation } from '../hooks/use-user-navigation';
import { GalleryVerticalEnd } from 'lucide-react';

export const WorkspaceRoutes = () => {
  const connectedUser = useConnectedUser() as User;
  const organizationId = useParams().organizationId;

  const { data: results } = useGetUserOrganizations(
    connectedUser.id as string,
    {
      fields: {
        id: null,
        name: null,
      },
      offset: 0,
      limit: 100,
    },
  );

  const baseWorkspaceUrl = `/w/${organizationId}`;

  const mainNavigation = useMainNavigation(baseWorkspaceUrl);
  const userNavigation = useUserNavigation(baseWorkspaceUrl);

  if (!results || results.data.length === 0) {
    return null;
  }

  if (!organizationId) {
    if (results.data.length > 0) {
      return <Navigate to={`/w/${results.data[0].id}/`} />;
    }
    return null;
  }

  return (
    <WorkspaceProvider selectedWorkspaceId={organizationId}>
      <Routes>
        <Route
          element={
            <AdminLayout
              connectedUser={connectedUser}
              mainNavigationGroups={mainNavigation}
              navUserItems={userNavigation}
              workspaces={{
                selectedWorkspaceId: organizationId,
                settingsUrl: `${baseWorkspaceUrl}/settings`,
                workspaces: results.data.map((e) => {
                  return {
                    name: e.name ?? 'Workspace',
                    logo: GalleryVerticalEnd,
                    id: e.id ?? '',
                    urlPrefix: `/w/${e.id}/`,
                  };
                }),
              }}
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
          <Route path="*" element={<Navigate to={'/'} />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  );
};

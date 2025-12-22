import { Navigate, Route, Routes } from 'react-router-dom';
import { useConnectedUser } from '@maas/core-store-session';
import { WorkspaceRoutes } from './workspace-routes';

export const ProtectedRoutes = () => {
  const connectedUser = useConnectedUser();

  if (!connectedUser) {
    return null;
  }
  return (
    <Routes>
      <Route path={'w/:organizationId?/*'} element={<WorkspaceRoutes />} />
      <Route path={'*'} element={<Navigate to={'/w/'} />} />
    </Routes>
  );
};

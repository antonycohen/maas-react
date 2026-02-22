import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useConnectedUser } from '@maas/core-store-session';
import { WorkspaceRoutes } from './workspace-routes';
import { useRoutes } from '@maas/core-workspace';
import { useEffect } from 'react';
import { SEO } from '@maas/core-seo';

export const AdminRoutes = () => {
    const connectedUser = useConnectedUser();
    const navigate = useNavigate();
    const routes = useRoutes();

    useEffect(() => {
        if (!connectedUser || !connectedUser.roles?.includes('ADMIN')) {
            navigate(routes.login(), { replace: true });
        }
    }, [connectedUser, navigate, routes]);

    if (!connectedUser || !connectedUser.roles?.includes('ADMIN')) {
        return null;
    }

    return (
        <>
            <SEO title="Admin" noindex />
            <Routes>
                <Route path={'w/:organizationId?/*'} element={<WorkspaceRoutes />} />
                <Route path={'*'} element={<Navigate to={'/admin/w/'} replace />} />
            </Routes>
        </>
    );
};

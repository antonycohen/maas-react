import { useOAuthStore } from '@maas/core-store-oauth';
import { useSessionStore } from '@maas/core-store-session';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { AdminRoutes } from '../../src/app/routes/admin-routes';

export default function Admin() {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const resetSession = useSessionStore((state) => state.resetSession);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            resetSession();
            navigate(PUBLIC_ROUTES.LOGIN, { replace: true });
        }
    }, [accessToken, navigate, resetSession]);

    if (!accessToken) {
        return null;
    }

    return <AdminRoutes />;
}

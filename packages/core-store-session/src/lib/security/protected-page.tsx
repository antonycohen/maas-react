import { useOAuthStore } from '@maas/core-store-oauth';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { useSessionStore } from '../store/session-store';

export const ProtectedPage = () => {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const resetSession = useSessionStore((state) => state.resetSession);
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        if (!accessToken) {
            resetSession();
            localStorage.setItem('target-url', `${pathname}${search}`);
            navigate(PUBLIC_ROUTES.LOGIN, { replace: true });
        }
    }, [accessToken, navigate, resetSession, pathname, search]);

    if (!accessToken) {
        return null;
    }

    return <Outlet />;
};

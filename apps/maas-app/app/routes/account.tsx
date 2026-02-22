import { useOAuthStore } from '@maas/core-store-oauth';
import { useSessionStore } from '@maas/core-store-session';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { useIsClient } from '@maas/core-utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AccountRoutes } from '@maas/web-feature-users';

export default function Account() {
    const isClient = useIsClient();
    const accessToken = useOAuthStore((state) => state.accessToken);
    const resetSession = useSessionStore((state) => state.resetSession);
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        if (!isClient) return;
        if (!accessToken) {
            resetSession();
            localStorage.setItem('target-url', `${pathname}${search}`);
            navigate(PUBLIC_ROUTES.LOGIN, { replace: true });
        }
    }, [isClient, accessToken, navigate, resetSession, pathname, search]);

    if (!isClient || !accessToken) {
        return null;
    }

    return <AccountRoutes />;
}

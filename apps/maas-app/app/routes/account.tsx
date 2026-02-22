import { useOAuthStore } from '@maas/core-store-oauth';
import { useSessionStore } from '@maas/core-store-session';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AccountRoutes } from '@maas/web-feature-users';

export default function Account() {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const resetSession = useSessionStore((state) => state.resetSession);
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        if (!accessToken) {
            resetSession();
            if (typeof window !== 'undefined') {
                localStorage.setItem('target-url', `${pathname}${search}`);
            }
            navigate(PUBLIC_ROUTES.LOGIN, { replace: true });
        }
    }, [accessToken, navigate, resetSession, pathname, search]);

    if (!accessToken) {
        return null;
    }

    return <AccountRoutes />;
}

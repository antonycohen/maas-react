import { useOAuthStore } from '@maas/core-store-oauth';
import { useSessionStore } from '@maas/core-store-session';
import { useEffect } from 'react';
import { useLocation, useNavigate, redirect } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { useIsClient } from '@maas/core-utils';
import { AdminRoutes } from '../../src/app/routes/admin-routes';
import type { Route } from './+types/admin';

// Server-side auth check — redirects before any HTML is sent
export function loader({ request }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get('Cookie') ?? '';
    const authCookie = cookieHeader.split('; ').find((c) => c.startsWith('auth-store='));

    if (authCookie) {
        try {
            const decoded = decodeURIComponent(authCookie.split('=').slice(1).join('='));
            const parsed = JSON.parse(decoded);
            if (parsed?.state?.accessToken) {
                return null;
            }
        } catch {
            // Invalid cookie — fall through to redirect
        }
    }

    const url = new URL(request.url);
    const targetUrl = `${url.pathname}${url.search}`;
    return redirect(`${PUBLIC_ROUTES.LOGIN}?target=${encodeURIComponent(targetUrl)}`);
}

export default function Admin() {
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

    return <AdminRoutes />;
}

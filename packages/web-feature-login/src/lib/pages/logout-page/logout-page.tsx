import { getLogoutUrl } from '@maas/core-api';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useSessionStore } from '@maas/core-store-session';
import { useEffect, useRef } from 'react';

export function LogoutPage() {
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;

        useOAuthStore.getState().reset();
        useSessionStore.getState().resetSession();

        document.location.href = getLogoutUrl();
    }, []);

    return null;
}

export default LogoutPage;

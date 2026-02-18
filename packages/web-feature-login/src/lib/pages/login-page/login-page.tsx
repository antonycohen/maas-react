import { getAuthorizationUrl } from '@maas/core-api';
import { useEffect, useRef } from 'react';

export function LoginPage() {
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        const searchParams = new URLSearchParams(window.location.search);
        getAuthorizationUrl()
            .then((url) => {
                document.location.href = `${url}&${searchParams.toString()}`;
            })
            .catch(() => {
                document.location.href = '/login?error=auth_failed';
            });
    }, []);

    return null;
}

export default LoginPage;

import { getAuthorizationUrl } from '@maas/core-api';
import { useEffect, useRef } from 'react';

export function LoginPage() {
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;
        const searchParams = new URLSearchParams(window.location.search);
        getAuthorizationUrl().then((url) => {
            document.location.href = `${url}&${searchParams.toString()}`;
        });
    }, []);

    return null;
}

export default LoginPage;

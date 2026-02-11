import { getTokensFromCodeRedirect } from '@maas/core-api';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const OauthCallbackPage = () => {
    const hasFetchToken = useRef(false);

    const setAuth = useOAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const url = window.location.href;
    const hasCodeParameter = new URLSearchParams(window.location.search).has('code');

    useEffect(() => {
        if (hasFetchToken.current) return;
        if (hasCodeParameter) {
            hasFetchToken.current = true;
            getTokensFromCodeRedirect(url)
                .then((response) => {
                    setAuth({
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        accessTokenExpirationDate: response.expiresAt,
                    });
                })
                .catch(() => {
                    navigate('/login');
                });
        }
    }, [hasCodeParameter, navigate, setAuth, url]);

    useEffect(() => {
        const unsubscribe = useOAuthStore.subscribe((newStore, previousStore) => {
            if (newStore.accessToken !== previousStore.accessToken) {
                navigate('/login/dispatcher');
            }
        });
        return unsubscribe;
    }, [navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">OAuth Callback Page</h1>
        </div>
    );
};

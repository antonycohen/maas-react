import { generateCodeVerifier, OAuth2Client } from '@badgateway/oauth2-client';
import { AuthenticationError } from '../api-client/authentication-error';
import { PUBLIC_ROUTES } from '@maas/core-routes';

export const VERIFIER_STORAGE = 'auth-store';

const oauthClient = new OAuth2Client({
    server: `${import.meta.env['VITE_API_URL']}`,
    clientId: `${import.meta.env['VITE_OAUTH_CLIENT_ID']}`,
    tokenEndpoint: '/token',
    authorizationEndpoint: '/authorize',
});

const getAuthorizationUrl = async () => {
    if (typeof window === 'undefined') throw new Error('getAuthorizationUrl is client-only');
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem(VERIFIER_STORAGE, codeVerifier);
    return oauthClient.authorizationCode.getAuthorizeUri({
        redirectUri: `${window.location.origin}${PUBLIC_ROUTES.LOGIN_CALLBACK}`,
        codeVerifier,
        state: 'state',
        scope: [''],
    });
};

const getTokensFromCodeRedirect = async (url: string) => {
    if (typeof window === 'undefined') throw new Error('getTokensFromCodeRedirect is client-only');
    const codeVerifier = localStorage.getItem(VERIFIER_STORAGE);
    if (!codeVerifier) {
        throw new AuthenticationError(
            'Code verifier not found in local storage. Please initiate the OAuth flow first.'
        );
    }

    return oauthClient.authorizationCode.getTokenFromCodeRedirect(url, {
        redirectUri: `${window.location.origin}${PUBLIC_ROUTES.LOGIN_CALLBACK}`,
        codeVerifier,
    });
};

const getNewToken = async (refreshToken: string) => {
    return oauthClient.refreshToken({
        refreshToken: refreshToken,
        accessToken: '',
        expiresAt: null,
    });
};

const loginWithPassword = async (username: string, password: string) => {
    const body = new URLSearchParams({
        grant_type: 'password',
        client_id: `${import.meta.env['VITE_OAUTH_CLIENT_ID']}`,
        client_secret: `${import.meta.env['VITE_OAUTH_CLIENT_SECRET']}`,
        username,
        password,
        scope: 'email',
    });

    const response = await fetch(`${import.meta.env['VITE_API_URL']}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new AuthenticationError(errorData?.error_description ?? 'Identifiants invalides.');
    }

    const data = await response.json();

    return {
        accessToken: data.access_token as string,
        refreshToken: (data.refresh_token as string) ?? null,
        expiresAt: Date.now() + (data.expires_in as number) * 1000,
    };
};

const getLogoutUrl = () => {
    return `${import.meta.env['VITE_API_URL']}/logout`;
};

export { getAuthorizationUrl, getTokensFromCodeRedirect, getNewToken, getLogoutUrl, loginWithPassword };

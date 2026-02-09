import { generateCodeVerifier, OAuth2Client } from '@badgateway/oauth2-client';
import { AuthenticationError } from '../api-client/authentication-error';

export const VERIFIER_STORAGE = 'auth-store';

const oauthClient = new OAuth2Client({
    server: `${import.meta.env['VITE_API_URL']}`,
    clientId: `${import.meta.env['VITE_OAUTH_CLIENT_ID']}`,
    tokenEndpoint: '/token',
    authorizationEndpoint: '/authorize',
});

const getAuthorizationUrl = async () => {
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem(VERIFIER_STORAGE, codeVerifier);
    return oauthClient.authorizationCode.getAuthorizeUri({
        redirectUri: `${window.location.origin}/login/callback`,
        codeVerifier,
        state: 'state',
        scope: [''],
    });
};

const getTokensFromCodeRedirect = async (url: string) => {
    const codeVerifier = localStorage.getItem(VERIFIER_STORAGE);
    if (!codeVerifier) {
        throw new AuthenticationError(
            'Code verifier not found in local storage. Please initiate the OAuth flow first.'
        );
    }

    return oauthClient.authorizationCode.getTokenFromCodeRedirect(url, {
        redirectUri: `${window.location.origin}/login/callback`,
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

const getLogoutUrl = () => {
    return `${import.meta.env['VITE_API_URL']}/logout`;
};

export { getAuthorizationUrl, getTokensFromCodeRedirect, getNewToken, getLogoutUrl };

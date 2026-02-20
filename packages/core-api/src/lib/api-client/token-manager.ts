import { useOAuthStore } from '@maas/core-store-oauth';
import { getNewToken } from '../oauth-client/oauth-client';
import { AuthenticationError } from './authentication-error';

const MAX_REFRESH_RETRIES = 3;
const LOCK_WAIT_MS = 150;

export class TokenManager {
    private refreshPromise: Promise<void> | null = null;
    private readonly LOCK_KEY = 'api-refresh-lock';
    private readonly LOCK_TIMEOUT = 10000;

    private acquireLock(): boolean {
        if (typeof window === 'undefined') return true;

        const now = Date.now();
        const currentLock = localStorage.getItem(this.LOCK_KEY);

        if (currentLock) {
            const lockTime = parseInt(currentLock, 10);
            if (now - lockTime < this.LOCK_TIMEOUT) {
                return false;
            }
        }

        localStorage.setItem(this.LOCK_KEY, String(now));
        return true;
    }

    private releaseLock() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.LOCK_KEY);
    }

    isTokenValid(): boolean {
        const { accessTokenExpirationDate } = useOAuthStore.getState();
        if (!accessTokenExpirationDate) return false;
        return Date.now() < accessTokenExpirationDate - 60000;
    }

    async refreshToken(): Promise<void> {
        const { refreshToken } = useOAuthStore.getState();
        if (!refreshToken) {
            throw new AuthenticationError('No refresh token available');
        }

        if (!this.acquireLock()) {
            // Another tab is refreshing — wait and check if it succeeded
            for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, LOCK_WAIT_MS));
                const { accessToken } = useOAuthStore.getState();
                if (accessToken && this.isTokenValid()) {
                    return;
                }
            }
            // Other tab's refresh didn't produce a valid token — force our own attempt
            this.releaseLock();
        }

        try {
            const response = await getNewToken(refreshToken);
            useOAuthStore.getState().setAuth({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                accessTokenExpirationDate: response.expiresAt ?? Date.now() + 3600 * 1000,
            });
        } catch {
            useOAuthStore.getState().reset();
            throw new AuthenticationError('Token refresh failed');
        } finally {
            this.releaseLock();
        }
    }

    resetAuth(): void {
        useOAuthStore.getState().reset();
    }

    async getValidToken(): Promise<string> {
        const { accessToken } = useOAuthStore.getState();

        if (!accessToken) {
            throw new AuthenticationError('No access token available');
        }

        if (this.isTokenValid()) {
            return accessToken;
        }

        if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken().finally(() => {
                this.refreshPromise = null;
            });
        }

        await this.refreshPromise;

        const newToken = useOAuthStore.getState().accessToken;
        if (!newToken) {
            throw new AuthenticationError('Failed to obtain valid token');
        }

        return newToken;
    }

    /**
     * Force a token refresh regardless of current token validity.
     * Used by the 401 response interceptor when the server rejects the token.
     */
    async forceRefresh(): Promise<string> {
        this.refreshPromise = this.refreshToken().finally(() => {
            this.refreshPromise = null;
        });

        await this.refreshPromise;

        const newToken = useOAuthStore.getState().accessToken;
        if (!newToken) {
            throw new AuthenticationError('Failed to obtain valid token after force refresh');
        }

        return newToken;
    }
}

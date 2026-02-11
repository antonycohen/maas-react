import { useOAuthStore } from '@maas/core-store-oauth';
import { getNewToken } from '../oauth-client/oauth-client';
import { AuthenticationError } from './authentication-error';

export class TokenManager {
    private refreshPromise: Promise<void> | null = null;
    private refreshLock: string | null = null;
    private readonly LOCK_KEY = 'api-refresh-lock';
    private readonly LOCK_TIMEOUT = 10000;

    constructor() {
        this.setupCrossTabLock();
    }

    private setupCrossTabLock() {
        if (typeof window === 'undefined') return;

        window.addEventListener('storage', (event) => {
            if (event.key === this.LOCK_KEY && event.newValue === null) {
                this.refreshLock = null;
            }
        });
    }

    private acquireLock(): boolean {
        if (typeof window === 'undefined') return true;

        const now = Date.now();
        const currentLock = localStorage.getItem(this.LOCK_KEY);

        if (currentLock) {
            const lockTime = parseInt(currentLock.split('-')[0], 10);
            if (now - lockTime < this.LOCK_TIMEOUT) {
                return false;
            }
        }

        const lockId = `${now}-${Math.random()}`;
        localStorage.setItem(this.LOCK_KEY, lockId);
        this.refreshLock = lockId;

        const storedLock = localStorage.getItem(this.LOCK_KEY);
        return storedLock === lockId;
    }

    private releaseLock() {
        if (typeof window === 'undefined') return;
        if (this.refreshLock) {
            localStorage.removeItem(this.LOCK_KEY);
            this.refreshLock = null;
        }
    }

    isTokenValid(): boolean {
        const { accessTokenExpirationDate } = useOAuthStore.getState();
        if (!accessTokenExpirationDate) return true;
        return Date.now() < accessTokenExpirationDate - 60000;
    }

    async refreshToken(): Promise<void> {
        const { refreshToken } = useOAuthStore.getState();
        if (!refreshToken) {
            throw new AuthenticationError('No refresh token available');
        }

        if (!this.acquireLock()) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const { accessToken } = useOAuthStore.getState();
            if (accessToken && this.isTokenValid()) {
                return;
            }
            return this.refreshToken();
        }

        try {
            const response = await getNewToken(refreshToken);
            useOAuthStore.getState().setAuth({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                accessTokenExpirationDate: response.expiresAt,
            });
        } finally {
            this.releaseLock();
        }
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
            this.refreshPromise = this.refreshToken()
                .catch((error) => {
                    if (error instanceof AuthenticationError) {
                        useOAuthStore.getState().reset();
                    }
                    throw error;
                })
                .finally(() => {
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
}

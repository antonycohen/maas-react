import { AUTH_STORAGE_KEY, AUTH_STORAGE_KEY_SYNC, useOAuthStore } from '../store/oauth-store';

const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split('; ').reduce(
        (acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = decodeURIComponent(value);

            return acc;
        },
        {} as Record<string, string>
    );

    return cookies[name] || null;
};

export const registerStoreSynchronizer = () => {
    if (typeof window !== 'undefined') {
        const syncStateFromStorage = async () => {
            try {
                const currentStoreValue = useOAuthStore.getState();
                const cookieValue = getCookieValue(AUTH_STORAGE_KEY);
                if (cookieValue && JSON.stringify(JSON.parse(cookieValue).state) != JSON.stringify(currentStoreValue)) {
                    useOAuthStore.setState(JSON.parse(cookieValue).state);
                }
            } catch (e) {
                console.warn('Failed to sync auth-store from storage', e);
            }
        };

        window.addEventListener('storage', (event) => {
            if (event.key === AUTH_STORAGE_KEY_SYNC && event.newValue) {
                void syncStateFromStorage();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                void syncStateFromStorage();
            }
        });
    }
};

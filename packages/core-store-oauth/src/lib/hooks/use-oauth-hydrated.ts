import { useSyncExternalStore } from 'react';
import { useOAuthStore } from '../store/oauth-store';

const subscribe = (callback: () => void) => useOAuthStore.persist.onFinishHydration(callback);
const getSnapshot = () => useOAuthStore.persist.hasHydrated();

/**
 * Returns true once the OAuth store has finished rehydrating from cookie storage.
 * Use this to avoid acting on the default (empty) state before persisted values are loaded.
 */
export const useOAuthHydrated = () => useSyncExternalStore(subscribe, getSnapshot, () => false);

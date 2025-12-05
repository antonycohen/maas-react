import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { createCookieStorage } from '../utils/cookie-storage';
import { OAuthActions, OAuthState } from '../../types';
import { registerStoreSynchronizer } from '../utils/store-synchronizer';

export const AUTH_STORAGE_KEY = 'auth-store';
export const AUTH_STORAGE_KEY_SYNC = 'auth-store-sync';


const cookieStorage = createCookieStorage<OAuthState & OAuthActions>(AUTH_STORAGE_KEY_SYNC);
const defaultInitialState: OAuthState = {
  accessToken: null,
  refreshToken: null,
  accessTokenExpirationDate: null,
};

export const useOAuthStore = create<OAuthState & OAuthActions>()(
  persist(
    (set) => ({
      ...defaultInitialState,
      setAuth: (authResponse) => set(authResponse),
      reset: () => set(defaultInitialState),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: cookieStorage
    },
  ),
);

registerStoreSynchronizer();

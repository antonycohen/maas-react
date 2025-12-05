import { useOAuthStore } from '../store/oauth-store';

export const useUserIdFromToken = (): string | null => {
  const token = useOAuthStore((state) => state?.accessToken);

  if (token) {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    return parsed.sub;
  }

  return null;
};

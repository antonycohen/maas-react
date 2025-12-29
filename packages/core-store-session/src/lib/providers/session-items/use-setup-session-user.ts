import { useEffect } from 'react';
import { useOAuthStore, useUserIdFromToken } from '@maas/core-store-oauth';
import { User } from '@maas/core-api-models';
import { useSessionStore } from '../../store/session-store';
import { FieldQuery, useGetUserById } from '@maas/core-api';

const userSessionFields: FieldQuery<User> = {
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
};

export function useSetupSessionUser() {
  const userId = useUserIdFromToken();
  const accessToken = useOAuthStore((state) => state.accessToken);
  const reset = useOAuthStore((state) => state.reset);

  const setConnectedUser = useSessionStore((state) => state.setConnectedUser);
  const setError = useSessionStore((state) => state.setError);

  const {
    data: userResponse,
    error: userError,
    isLoading,
    ...userQuery
  } = useGetUserById(
    {
      id: userId ?? 'me',
      fields: userSessionFields,
    },
    { enabled: !!accessToken },
  );

  useEffect(() => {
    if (userError) {
      setError(userError);
      return;
    }

    if (userResponse && !isLoading) {
      setConnectedUser(userResponse);
    }

    if (!userResponse && !isLoading) {
      reset();
    }
  }, [userError, userResponse, setError, setConnectedUser, accessToken, reset, isLoading, userId]);

  return { userResponse, userError,isLoading, ...userQuery };
}

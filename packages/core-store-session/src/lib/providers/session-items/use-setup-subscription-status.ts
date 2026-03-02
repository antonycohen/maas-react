import { useEffect } from 'react';
import { useOAuthStore } from '@maas/core-store-oauth';
import { useGetMySubscriptionStatus } from '@maas/core-api';
import { useSessionStore } from '../../store/session-store';

export function useSetupSubscriptionStatus() {
    const accessToken = useOAuthStore((state) => state.accessToken);
    const setSubscriptionStatus = useSessionStore((state) => state.setSubscriptionStatus);

    const {
        data: statusResponse,
        error: statusError,
        isLoading,
        isFetched,
    } = useGetMySubscriptionStatus({ enabled: !!accessToken });

    useEffect(() => {
        if (statusError) {
            setSubscriptionStatus(null);
            return;
        }
        if (statusResponse && !isLoading) {
            setSubscriptionStatus(statusResponse);
        }

        if (!statusResponse && !isLoading && isFetched) {
            setSubscriptionStatus(null);
        }
    }, [statusError, statusResponse, setSubscriptionStatus, isLoading, isFetched]);

    return { isLoading };
}

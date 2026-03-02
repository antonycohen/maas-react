import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getMySubscriptionStatus } from '@maas/core-api';
import { useSessionStore } from '../store/session-store';

export const useRefreshSubscriptionStatus = () => {
    const queryClient = useQueryClient();
    const setSubscriptionStatus = useSessionStore((state) => state.setSubscriptionStatus);

    const refresh = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['subscriptions', 'me', 'status'] });
        try {
            const status = await getMySubscriptionStatus();
            setSubscriptionStatus(status);
        } catch {
            // Non-fatal - subscription status will be retried on next page load
        }
    }, [queryClient, setSubscriptionStatus]);

    return { refresh };
};

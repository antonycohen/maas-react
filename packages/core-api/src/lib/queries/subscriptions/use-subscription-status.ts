import { useGetMySubscriptionStatus } from './use-get-my-subscription-status';

/**
 * @deprecated Use `useSubscriptionStatus` from `@maas/core-store-session` instead.
 * This hook uses React Query directly; the store-based version is hydrated at session bootstrap.
 */
export const useSubscriptionStatus = () => {
    const { data, isLoading } = useGetMySubscriptionStatus();

    return {
        isUserSubscribed: data?.isSubscribed ?? false,
        isLoading,
    };
};

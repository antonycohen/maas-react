import { useGetMySubscriptionStatus } from './use-get-my-subscription-status';

export const useSubscriptionStatus = () => {
    const { data, isLoading } = useGetMySubscriptionStatus();

    return {
        isUserSubscribed: data?.isSubscribed ?? false,
        isLoading,
    };
};

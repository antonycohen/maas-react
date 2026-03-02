import { useSessionStore } from '../store/session-store';

export const useSubscriptionStatus = () => {
    const subscriptionStatus = useSessionStore((state) => state.subscriptionStatus);
    console.log(subscriptionStatus);
    return {
        isUserSubscribed: subscriptionStatus?.isSubscribed ?? false,
        status: subscriptionStatus?.status ?? null,
        subscriptionId: subscriptionStatus?.subscriptionId ?? null,
        quotas: subscriptionStatus?.quotas ?? [],
    };
};

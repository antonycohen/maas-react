import { useSessionStore } from '../store/session-store';

export const useQuota = (featureKey: string) => {
    const subscriptionStatus = useSessionStore((state) => state.subscriptionStatus);
    const quota = subscriptionStatus?.quotas?.find((q) => q.featureKey === featureKey) ?? null;

    return {
        quota,
        hasQuota: quota !== null,
        remaining: quota?.remaining ?? 0,
        isExhausted: quota ? quota.remaining <= 0 : true,
    };
};

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError, AuthenticationError, maasApi, MySubscriptionStatus } from '../../api';

export const getMySubscriptionStatus = async (): Promise<MySubscriptionStatus> => {
    return await maasApi.subscriptions.getMySubscriptionStatus();
};

export const useGetMySubscriptionStatus = (
    options?: Omit<UseQueryOptions<MySubscriptionStatus, ApiError>, 'queryKey' | 'queryFn'>
) =>
    useQuery({
        queryKey: ['subscriptions', 'me', 'status'],
        queryFn: getMySubscriptionStatus,
        retry: (_failureCount, error) => {
            if ((error instanceof AuthenticationError && error.code === 700) || error.code === 800) return false;
            return _failureCount < 3;
        },
        ...options,
    });

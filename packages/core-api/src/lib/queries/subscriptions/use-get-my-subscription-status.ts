import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError, maasApi, MySubscriptionStatus } from '../../api';

export const getMySubscriptionStatus = async (): Promise<MySubscriptionStatus> => {
    return await maasApi.subscriptions.getMySubscriptionStatus();
};

export const useGetMySubscriptionStatus = (
    options?: Omit<UseQueryOptions<MySubscriptionStatus, ApiError>, 'queryKey' | 'queryFn'>
) =>
    useQuery({
        queryKey: ['subscriptions', 'me', 'status'],
        queryFn: getMySubscriptionStatus,
        ...options,
    });

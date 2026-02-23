import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { FieldQuery } from '../../types';

export const getMySubscription = async (fields?: FieldQuery<Subscription>): Promise<Subscription> => {
    return await maasApi.subscriptions.getMySubscription(fields);
};

export const useGetMySubscription = (
    fields?: FieldQuery<Subscription>,
    options?: Omit<UseQueryOptions<Subscription, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['subscriptions', 'me', fields],
        queryFn: () => getMySubscription(fields),
        retry: (failureCount, error) => {
            if (error.code === 900) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });

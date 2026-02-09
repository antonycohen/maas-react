import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getSubscriptionById = async (params: GetQueryByIdParams<Subscription>): Promise<Subscription> => {
    return await maasApi.subscriptions.getSubscription(params);
};

export const useGetSubscriptionById = (
    params: GetQueryByIdParams<Subscription>,
    options?: Omit<UseQueryOptions<Subscription, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['subscription', params.id, params.fields],
        queryFn: () => getSubscriptionById(params),
        ...options,
    });

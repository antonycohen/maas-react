import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi, GetSubscriptionsFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetSubscriptionsParams<S = undefined> = GetCollectionQueryParams<Subscription, S> & {
    filters?: GetSubscriptionsFilter;
};

export const getSubscriptions = async <S = undefined>(
    params: GetSubscriptionsParams<S>
): Promise<ApiCollectionResponse<Subscription>> => {
    return await maasApi.subscriptions.getSubscriptions(params as any);
};

export const useGetSubscriptions = <S = undefined>(
    params: GetSubscriptionsParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Subscription>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['subscriptions', params],
        queryFn: () => getSubscriptions(params),
        ...options,
    });

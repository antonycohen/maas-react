import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Price } from '@maas/core-api-models';
import { ApiError, maasApi, GetPricesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetPricesParams<S = undefined> = GetCollectionQueryParams<Price, S> & {
    filters?: GetPricesFilter;
};

export const getPrices = async <S = undefined>(params: GetPricesParams<S>): Promise<ApiCollectionResponse<Price>> => {
    return await maasApi.prices.getPrices(params as any);
};

export const useGetPrices = <S = undefined>(
    params: GetPricesParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Price>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['prices', params],
        queryFn: () => getPrices(params),
        ...options,
    });

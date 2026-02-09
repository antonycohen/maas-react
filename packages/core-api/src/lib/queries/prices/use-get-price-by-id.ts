import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Price } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getPriceById = async (params: GetQueryByIdParams<Price>): Promise<Price> => {
    return await maasApi.prices.getPrice(params);
};

export const useGetPriceById = (
    params: GetQueryByIdParams<Price>,
    options?: Omit<UseQueryOptions<Price, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['price', params.id, params.fields],
        queryFn: () => getPriceById(params),
        ...options,
    });

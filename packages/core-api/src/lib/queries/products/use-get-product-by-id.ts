import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Product } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getProductById = async (params: GetQueryByIdParams<Product>): Promise<Product> => {
    return await maasApi.products.getProduct(params);
};

export const useGetProductById = (
    params: GetQueryByIdParams<Product>,
    options?: Omit<UseQueryOptions<Product, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['product', params.id, params.fields],
        queryFn: () => getProductById(params),
        ...options,
    });

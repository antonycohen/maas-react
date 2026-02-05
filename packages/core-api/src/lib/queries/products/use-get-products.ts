import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Product } from '@maas/core-api-models';
import { ApiError, maasApi, GetProductsFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetProductsParams<S = undefined> = GetCollectionQueryParams<Product, S> & {
    filters?: GetProductsFilter;
};

export const getProducts = async <S = undefined>(
    params: GetProductsParams<S>
): Promise<ApiCollectionResponse<Product>> => {
    return await maasApi.products.getProducts(params as any);
};

export const useGetProducts = <S = undefined>(
    params: GetProductsParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Product>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
        ...options,
    });

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ProductFeature } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export interface GetProductFeaturesParams {
    productId: string;
}

export const getProductFeatures = async (params: GetProductFeaturesParams): Promise<ProductFeature[]> => {
    return await maasApi.products.getProductFeatures(params.productId);
};

export const useGetProductFeatures = (
    params: GetProductFeaturesParams,
    options?: Omit<UseQueryOptions<ProductFeature[], ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['products', params.productId, 'features'],
        queryFn: () => getProductFeatures(params),
        ...options,
    });

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Feature } from '@maas/core-api-models';
import { ApiError, maasApi, GetFeaturesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetFeaturesParams<S = undefined> = GetCollectionQueryParams<Feature, S> & {
    filters?: GetFeaturesFilter;
};

export const getFeatures = async <S = undefined>(
    params: GetFeaturesParams<S>
): Promise<ApiCollectionResponse<Feature>> => {
    return await maasApi.features.getFeatures(params as any);
};

export const useGetFeatures = <S = undefined>(
    params: GetFeaturesParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Feature>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['features', params],
        queryFn: () => getFeatures(params),
        ...options,
    });

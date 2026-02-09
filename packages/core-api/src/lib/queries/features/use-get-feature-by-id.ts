import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Feature } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getFeatureById = async (params: GetQueryByIdParams<Feature>): Promise<Feature> => {
    return await maasApi.features.getFeature(params);
};

export const useGetFeatureById = (
    params: GetQueryByIdParams<Feature>,
    options?: Omit<UseQueryOptions<Feature, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['feature', params.id, params.fields],
        queryFn: () => getFeatureById(params),
        ...options,
    });

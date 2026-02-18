import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { HomepageResponse } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetHomepageParams } from '../../endpoints/homepage';

export const getHomepage = async (params?: GetHomepageParams): Promise<HomepageResponse> => {
    return await maasApi.homepage.getHomepage(params);
};

export const useGetHomepage = (
    params?: GetHomepageParams,
    options?: Omit<UseQueryOptions<HomepageResponse, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['homepage', params],
        queryFn: () => getHomepage(params),
        ...options,
    });

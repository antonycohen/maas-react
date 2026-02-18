import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DiffusionList } from '@maas/core-api-models';
import { ApiError, maasApi, GetDiffusionListsFilter, GetDiffusionListsStaticParams } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetDiffusionListsParams<S = GetDiffusionListsStaticParams> = GetCollectionQueryParams<DiffusionList, S> & {
    filters?: GetDiffusionListsFilter;
};

export const getDiffusionLists = async <S = GetDiffusionListsStaticParams>(
    params: GetDiffusionListsParams<S>
): Promise<ApiCollectionResponse<DiffusionList>> => {
    return await maasApi.diffusionLists.getDiffusionLists(params as GetDiffusionListsParams);
};

export const useGetDiffusionLists = <S = GetDiffusionListsStaticParams>(
    params: GetDiffusionListsParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<DiffusionList>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['diffusion-lists', params],
        queryFn: () => getDiffusionLists(params),
        ...options,
    });

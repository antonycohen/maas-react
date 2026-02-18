import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';
import { DiffusionListEntry } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetDiffusionListEntriesFilter, GetDiffusionListEntriesStaticParams } from '../../endpoints/diffusion-lists';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type GetDiffusionListEntriesParams = GetCollectionQueryParams<
    DiffusionListEntry,
    GetDiffusionListEntriesStaticParams
> & {
    filters?: GetDiffusionListEntriesFilter;
};

export const getDiffusionListEntries = async (
    params: GetDiffusionListEntriesParams
): Promise<ApiCollectionResponse<DiffusionListEntry>> => {
    return await maasApi.diffusionLists.getDiffusionListEntries(params);
};

export const useGetDiffusionListEntries = (
    params: GetDiffusionListEntriesParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<DiffusionListEntry>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['diffusion-list-entries', params.staticParams?.diffusionListId, params],
        queryFn: () => getDiffusionListEntries(params),
        ...options,
    });

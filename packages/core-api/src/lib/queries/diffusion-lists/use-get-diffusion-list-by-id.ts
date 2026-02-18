import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DiffusionList } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getDiffusionListById = async (params: GetQueryByIdParams<DiffusionList>): Promise<DiffusionList> => {
    return await maasApi.diffusionLists.getDiffusionList(params);
};

export const useGetDiffusionListById = (
    params: GetQueryByIdParams<DiffusionList>,
    options?: Omit<UseQueryOptions<DiffusionList, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['diffusion-list', params.id, params.fields],
        queryFn: () => getDiffusionListById(params),
        ...options,
    });

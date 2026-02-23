import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Folder } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryBySlugParams } from '../../types';

export const getFolderBySlug = async (params: GetQueryBySlugParams<Folder>): Promise<Folder> => {
    return await maasApi.folders.getFolderBySlug(params);
};

export const useGetFolderBySlug = (
    params: GetQueryBySlugParams<Folder>,
    options?: Omit<UseQueryOptions<Folder, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['folder', 'slug', params.slug, params.fields],
        queryFn: () => getFolderBySlug(params),
        ...options,
    });

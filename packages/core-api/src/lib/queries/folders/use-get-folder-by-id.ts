import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Folder } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getFolderById = async (
  params: GetQueryByIdParams<Folder>
): Promise<Folder> => {
  return await maasApi.folders.getFolder(params);
};

export const useGetFolderById = (
  params: GetQueryByIdParams<Folder>,
  options?: Omit<UseQueryOptions<Folder, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['folder', params.id, params.fields],
    queryFn: () => getFolderById(params),
    ...options,
  });

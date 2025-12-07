import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Folder } from '@maas/core-api-models';
import { ApiError, maasApi, GetFoldersFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetFoldersParams = GetCollectionQueryParams<Folder> & {
  filters?: GetFoldersFilter;
};

export const getFolders = async (
  params: GetFoldersParams
): Promise<ApiCollectionResponse<Folder>> => {
  return await maasApi.folders.getFolders(params);
};

export const useGetFolders = (
  params: GetFoldersParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Folder>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['folders', params],
    queryFn: () => getFolders(params),
    ...options,
  });

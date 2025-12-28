import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Enum } from '@maas/core-api-models';
import { ApiError, maasApi, GetEnumsFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetEnumsParams = GetCollectionQueryParams<Enum> & {
  filters?: GetEnumsFilter;
};

export const getEnums = async (
  params: GetEnumsParams
): Promise<ApiCollectionResponse<Enum>> => {
  return await maasApi.enums.getEnums(params);
};

export const useGetEnums = (
  params: GetEnumsParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Enum>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['enums', params],
    queryFn: () => getEnums(params),
    ...options,
  });

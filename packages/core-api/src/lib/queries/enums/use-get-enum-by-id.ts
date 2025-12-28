import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Enum } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getEnumById = async (
  params: GetQueryByIdParams<Enum>
): Promise<Enum> => {
  return await maasApi.enums.getEnum(params);
};

export const useGetEnumById = (
  params: GetQueryByIdParams<Enum>,
  options?: Omit<UseQueryOptions<Enum, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['enum', params.id, params.fields],
    queryFn: () => getEnumById(params),
    ...options,
  });

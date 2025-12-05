import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Brand } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getBrandById = async (
  params: GetQueryByIdParams<Brand>
): Promise<Brand> => {
  return await maasApi.brands.getBrand(params);
};

export const useGetBrandById = (
  params: GetQueryByIdParams<Brand>,
  options?: Omit<UseQueryOptions<Brand, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['brand', params.id, params.fields],
    queryFn: () => getBrandById(params),
    ...options,
  });

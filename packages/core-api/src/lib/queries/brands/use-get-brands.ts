import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Brand } from '@maas/core-api-models';
import { ApiError, maasApi, GetBrandsFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetBrandsParams = GetCollectionQueryParams<Brand> & {
  filters?: GetBrandsFilter;
};

export const getBrands = async (
  params: GetBrandsParams
): Promise<ApiCollectionResponse<Brand>> => {
  return await maasApi.brands.getBrands(params);
};

export const useGetBrands = (
  params: GetBrandsParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Brand>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['brands', params],
    queryFn: () => getBrands(params),
    ...options,
  });

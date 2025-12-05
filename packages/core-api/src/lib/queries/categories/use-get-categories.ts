import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Category } from '@maas/core-api-models';
import { ApiError, maasApi, GetCategoriesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetCategoriesParams = GetCollectionQueryParams<Category> & {
  filters?: GetCategoriesFilter;
};

export const getCategories = async (
  params: GetCategoriesParams
): Promise<ApiCollectionResponse<Category>> => {
  return await maasApi.categories.getCategories(params);
};

export const useGetCategories = (
  params: GetCategoriesParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Category>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
    ...options,
  });

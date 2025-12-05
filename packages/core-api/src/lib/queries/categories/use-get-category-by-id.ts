import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Category } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getCategoryById = async (
  params: GetQueryByIdParams<Category>
): Promise<Category> => {
  return await maasApi.categories.getCategory(params);
};

export const useGetCategoryById = (
  params: GetQueryByIdParams<Category>,
  options?: Omit<UseQueryOptions<Category, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['category', params.id, params.fields],
    queryFn: () => getCategoryById(params),
    ...options,
  });

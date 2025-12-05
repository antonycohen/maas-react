import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Category, UpdateCategory } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateCategoryParams = {
  categoryId: string;
  data: UpdateCategory;
};

export const updateCategory = async (
  params: UpdateCategoryParams,
): Promise<Category> => {
  return await maasApi.categories.patchCategory(params.categoryId, params.data);
};

export const useUpdateCategory = (
  options?: Omit<
    UseMutationOptions<Category, ApiError, UpdateCategoryParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({
        queryKey: ['category', variables.categoryId],
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

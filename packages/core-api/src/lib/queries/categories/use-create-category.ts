import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Category, CreateCategory } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createCategory = async (data: CreateCategory): Promise<Category> => {
  return await maasApi.categories.createCategory(data);
};

export const useCreateCategory = (
  options?: Omit<UseMutationOptions<Category, ApiError, CreateCategory>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

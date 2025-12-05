import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteCategory = async (categoryId: string): Promise<void> => {
  return await maasApi.categories.deleteCategory(categoryId);
};

export const useDeleteCategory = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

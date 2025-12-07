import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteArticle = async (articleId: string): Promise<void> => {
  return await maasApi.articles.deleteArticle(articleId);
};

export const useDeleteArticle = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

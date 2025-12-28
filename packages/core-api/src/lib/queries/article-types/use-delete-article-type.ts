import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteArticleType = async (
  articleTypeId: string,
): Promise<void> => {
  return await maasApi.articleTypes.deleteArticleType(articleTypeId);
};

export const useDeleteArticleType = (
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticleType,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articleTypes'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

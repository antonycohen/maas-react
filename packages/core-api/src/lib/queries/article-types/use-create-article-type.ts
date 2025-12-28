import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { ArticleType, CreateArticleType } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createArticleType = async (
  data: CreateArticleType,
): Promise<ArticleType> => {
  return await maasApi.articleTypes.createArticleType(data);
};

export const useCreateArticleType = (
  options?: Omit<
    UseMutationOptions<ArticleType, ApiError, CreateArticleType>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticleType,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articleTypes'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

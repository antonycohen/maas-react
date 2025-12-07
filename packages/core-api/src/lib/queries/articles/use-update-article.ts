import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Article, UpdateArticle } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateArticleParams = {
  articleId: string;
  data: UpdateArticle;
};

export const updateArticle = async (
  params: UpdateArticleParams,
): Promise<Article> => {
  return await maasApi.articles.patchArticle(params.articleId, params.data);
};

export const useUpdateArticle = (
  options?: Omit<
    UseMutationOptions<Article, ApiError, UpdateArticleParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({
        queryKey: ['article', variables.articleId],
      });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

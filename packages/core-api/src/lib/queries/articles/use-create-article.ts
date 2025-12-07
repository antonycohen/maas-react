import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Article, CreateArticle } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createArticle = async (data: CreateArticle): Promise<Article> => {
  return await maasApi.articles.createArticle(data);
};

export const useCreateArticle = (
  options?: Omit<
    UseMutationOptions<Article, ApiError, CreateArticle>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { ArticleType, UpdateArticleType } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateArticleTypeParams = {
  articleTypeId: string;
  data: UpdateArticleType;
};

export const updateArticleType = async (
  params: UpdateArticleTypeParams,
): Promise<ArticleType> => {
  return await maasApi.articleTypes.patchArticleType(
    params.articleTypeId,
    params.data,
  );
};

export const useUpdateArticleType = (
  options?: Omit<
    UseMutationOptions<ArticleType, ApiError, UpdateArticleTypeParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticleType,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['articleTypes'] });
      queryClient.invalidateQueries({
        queryKey: ['articleType', variables.articleTypeId],
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};

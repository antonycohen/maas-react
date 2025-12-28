import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ArticleType } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getArticleTypeById = async (
  params: GetQueryByIdParams<ArticleType>,
): Promise<ArticleType> => {
  return await maasApi.articleTypes.getArticleType(params);
};

export const useGetArticleTypeById = (
  params: GetQueryByIdParams<ArticleType>,
  options?: Omit<UseQueryOptions<ArticleType, ApiError>, 'queryKey'>,
) =>
  useQuery({
    queryKey: ['articleType', params.id, params.fields],
    queryFn: () => getArticleTypeById(params),
    ...options,
  });

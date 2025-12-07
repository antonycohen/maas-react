import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getArticleById = async (
  params: GetQueryByIdParams<Article>
): Promise<Article> => {
  return await maasApi.articles.getArticle(params);
};

export const useGetArticleById = (
  params: GetQueryByIdParams<Article>,
  options?: Omit<UseQueryOptions<Article, ApiError>, 'queryKey'>
) =>
  useQuery({
    queryKey: ['article', params.id, params.fields],
    queryFn: () => getArticleById(params),
    ...options,
  });

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@maas/core-api-models';
import { ApiError, maasApi, GetArticlesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetArticlesParams = GetCollectionQueryParams<Article> & {
  filters?: GetArticlesFilter;
};

export const getArticles = async (
  params: GetArticlesParams
): Promise<ApiCollectionResponse<Article>> => {
  return await maasApi.articles.getArticles(params);
};

export const useGetArticles = (
  params: GetArticlesParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<Article>, ApiError>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
    ...options,
  });

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ArticleType } from '@maas/core-api-models';
import { ApiError, maasApi, GetArticleTypesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetArticleTypesParams = GetCollectionQueryParams<ArticleType> & {
  filters?: GetArticleTypesFilter;
};

export const getArticleTypes = async (
  params: GetArticleTypesParams,
): Promise<ApiCollectionResponse<ArticleType>> => {
  return await maasApi.articleTypes.getArticleTypes(params);
};

export const useGetArticleTypes = (
  params: GetArticleTypesParams,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<ArticleType>, ApiError>,
    'queryKey'
  >,
) =>
  useQuery({
    queryKey: ['articleTypes', params],
    queryFn: () => getArticleTypes(params),
    ...options,
  });

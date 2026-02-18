import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetSimilarArticlesParams = GetCollectionQueryParams<Article> & {
    articleId: string;
};

export const getSimilarArticles = async (params: GetSimilarArticlesParams): Promise<ApiCollectionResponse<Article>> => {
    return await maasApi.articles.getSimilarArticles(params);
};

export const useGetSimilarArticles = (
    params: GetSimilarArticlesParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Article>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['articles', 'similar', params.articleId, params],
        queryFn: () => getSimilarArticles(params),
        ...options,
    });

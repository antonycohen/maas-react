import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@maas/core-api-models';
import { ApiError, maasApi, GetArticlesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetArticlesParams<S = undefined> = GetCollectionQueryParams<Article, S> & {
    filters?: GetArticlesFilter;
};

export const getArticles = async <S = undefined>(
    params: GetArticlesParams<S>
): Promise<ApiCollectionResponse<Article>> => {
    return await maasApi.articles.getArticles(params as any);
};

export const useGetArticles = <S = undefined>(
    params: GetArticlesParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Article>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['articles', params],
        queryFn: () => getArticles(params),
        ...options,
    });

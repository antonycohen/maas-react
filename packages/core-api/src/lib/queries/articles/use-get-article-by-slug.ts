import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Article } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryBySlugParams } from '../../types';

export const getArticleBySlug = async (params: GetQueryBySlugParams<Article>): Promise<Article> => {
    return await maasApi.articles.getArticleBySlug(params);
};

export const useGetArticleBySlug = (
    params: GetQueryBySlugParams<Article>,
    options?: Omit<UseQueryOptions<Article, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['article', 'slug', params.slug, params.fields],
        queryFn: () => getArticleBySlug(params),
        ...options,
    });

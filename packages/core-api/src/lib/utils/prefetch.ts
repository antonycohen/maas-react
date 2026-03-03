import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getArticleBySlug } from '../queries/articles/use-get-article-by-slug';
import { getIssueBySlug } from '../queries/issues/use-get-issue-by-slug';
import { getFolderBySlug } from '../queries/folders/use-get-folder-by-slug';
import { Article, Issue, Folder } from '@maas/core-api-models';
import { FieldQuery } from '../types';

const ARTICLE_DETAIL_FIELDS: FieldQuery<Article> = {
    id: null,
    content: null,
    title: null,
    description: null,
    keywords: null,
    publishedAt: null,
    featuredImage: null,
    cover: null,
    categories: null,
    visibility: null,
    customFields: null,
    type: { fields: { name: null } },
    author: { fields: { id: null, firstName: null, lastName: null, profileImage: null } },
};

const ISSUE_DETAIL_FIELDS: FieldQuery<Issue> = {
    id: null,
    title: null,
    description: null,
    publishedAt: null,
    issueNumber: null,
    cover: { fields: { resizedImages: null, downloadUrl: null } },
    brand: null,
};

const FOLDER_DETAIL_FIELDS: FieldQuery<Folder> = {
    id: null,
    slug: null,
    name: null,
    description: null,
    cover: { fields: { resizedImages: null } },
    articles: {
        fields: {
            id: null,
            title: null,
            slug: null,
            cover: { fields: { resizedImages: null } },
            author: { fields: { firstName: null, lastName: null } },
        },
    },
    articleCount: null,
};

export function usePrefetchArticle() {
    const queryClient = useQueryClient();
    return useCallback(
        (slug: string) => {
            queryClient.prefetchQuery({
                queryKey: ['article', 'slug', slug, ARTICLE_DETAIL_FIELDS],
                queryFn: () => getArticleBySlug({ slug, fields: ARTICLE_DETAIL_FIELDS }),
                staleTime: 5 * 60 * 1000,
            });
        },
        [queryClient]
    );
}

export function usePrefetchIssue() {
    const queryClient = useQueryClient();
    return useCallback(
        (slug: string) => {
            queryClient.prefetchQuery({
                queryKey: ['issue', 'slug', slug, ISSUE_DETAIL_FIELDS],
                queryFn: () => getIssueBySlug({ slug, fields: ISSUE_DETAIL_FIELDS }),
                staleTime: 5 * 60 * 1000,
            });
        },
        [queryClient]
    );
}

export function usePrefetchFolder() {
    const queryClient = useQueryClient();
    return useCallback(
        (slug: string) => {
            queryClient.prefetchQuery({
                queryKey: ['folder', 'slug', slug, FOLDER_DETAIL_FIELDS],
                queryFn: () => getFolderBySlug({ slug, fields: FOLDER_DETAIL_FIELDS }),
                staleTime: 5 * 60 * 1000,
            });
        },
        [queryClient]
    );
}

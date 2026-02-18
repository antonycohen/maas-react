import { Article, CreateArticle, UpdateArticle } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/articles';

export interface GetArticlesFilter {
    title?: string;
    organizationId?: string;
    authorId?: string;
    typeId?: string;
    visibility?: string;
    isPublished?: boolean;
    folderId?: string;
    categorySlug?: string;
    id?: string[] | string;
}

export class ArticlesEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of articles
     * GET /api/v1/articles
     */
    async getArticles(
        params: GetCollectionQueryParams<Article> & { filters?: GetArticlesFilter }
    ): Promise<ApiCollectionResponse<Article>> {
        params.filters = {
            ...params.filters,
            ...(params.staticParams as GetCollectionQueryParams<Article>['filters']),
        };
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Article>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.title && { title: filters.title }),
            ...(filters?.id && { id: filters.id }),
            ...(filters?.organizationId && { organization_id: filters.organizationId }),
            ...(filters?.authorId && { author_id: filters.authorId }),
            ...(filters?.typeId && { type_id: filters.typeId }),
            ...(filters?.visibility && { visibility: filters.visibility }),
            ...(filters?.isPublished !== undefined && { is_published: filters.isPublished }),
            ...(filters?.folderId && { folder_id: filters.folderId }),
            ...(filters?.categorySlug && { categorySlug: filters.categorySlug }),
        });
    }

    /**
     * Get a single article by ID
     * GET /api/v1/articles/{articleId}
     */
    async getArticle(params: GetQueryByIdParams<Article>): Promise<Article> {
        return this.client.getById<Article>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new article
     * POST /api/v1/articles
     */
    async createArticle(data: CreateArticle): Promise<Article> {
        return this.client.post<Article>(BASE_PATH, data);
    }

    /**
     * Update an article (full replacement)
     * PUT /api/v1/articles/{articleId}
     */
    async updateArticle(articleId: string, data: UpdateArticle): Promise<Article> {
        return this.client.put<Article>(`${BASE_PATH}/${articleId}`, data);
    }

    /**
     * Patch an article (partial update)
     * PATCH /api/v1/articles/{articleId}
     */
    async patchArticle(articleId: string, data: Partial<UpdateArticle>): Promise<Article> {
        return this.client.patch<Article>(`${BASE_PATH}/${articleId}`, data);
    }

    /**
     * Delete an article
     * DELETE /api/v1/articles/{articleId}
     */
    async deleteArticle(articleId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${articleId}`);
    }
}

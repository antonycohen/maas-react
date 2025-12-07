import {
  Article,
  CreateArticle,
  UpdateArticle,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/magazine/articles';

export interface GetArticlesFilter {
  issueId?: string;
  folderId?: string;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  tags?: string;
  term?: string;
}

export class ArticlesEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of articles
   * GET /api/v1/magazine/articles
   */
  async getArticles(
    params: GetCollectionQueryParams<Article> & { filters?: GetArticlesFilter }
  ): Promise<ApiCollectionResponse<Article>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<Article>(BASE_PATH, fields, {
      offset,
      limit,
      ...(filters?.issueId && { issue_id: filters.issueId }),
      ...(filters?.folderId && { folder_id: filters.folderId }),
      ...(filters?.authorId && { author_id: filters.authorId }),
      ...(filters?.isPublished !== undefined && { is_published: filters.isPublished }),
      ...(filters?.isFeatured !== undefined && { is_featured: filters.isFeatured }),
      ...(filters?.tags && { tags: filters.tags }),
      ...(filters?.term && { term: filters.term }),
    });
  }

  /**
   * Get a single article by ID
   * GET /api/v1/magazine/articles/{articleId}
   */
  async getArticle(params: GetQueryByIdParams<Article>): Promise<Article> {
    return this.client.getById<Article>(
      `${BASE_PATH}/${params.id}`,
      params.fields
    );
  }

  /**
   * Create a new article
   * POST /api/v1/magazine/articles
   */
  async createArticle(data: CreateArticle): Promise<Article> {
    return this.client.post<Article>(BASE_PATH, data);
  }

  /**
   * Update an article (full replacement)
   * PUT /api/v1/magazine/articles/{articleId}
   */
  async updateArticle(
    articleId: string,
    data: UpdateArticle
  ): Promise<Article> {
    return this.client.put<Article>(`${BASE_PATH}/${articleId}`, data);
  }

  /**
   * Patch an article (partial update)
   * PATCH /api/v1/magazine/articles/{articleId}
   */
  async patchArticle(
    articleId: string,
    data: Partial<UpdateArticle>
  ): Promise<Article> {
    return this.client.patch<Article>(`${BASE_PATH}/${articleId}`, data);
  }

  /**
   * Delete an article
   * DELETE /api/v1/magazine/articles/{articleId}
   */
  async deleteArticle(articleId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${articleId}`);
  }
}

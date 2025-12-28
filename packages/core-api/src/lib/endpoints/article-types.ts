import {
  ArticleType,
  CreateArticleType,
  UpdateArticleType,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/magazine/article-types';

export interface GetArticleTypesFilter {
  organizationId?: string;
  name?: string;
  key?: string;
  isActive?: boolean;
}

export class ArticleTypesEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of article types
   * GET /api/v1/magazine/article-types
   */
  async getArticleTypes(
    params: GetCollectionQueryParams<ArticleType> & {
      filters?: GetArticleTypesFilter;
    },
  ): Promise<ApiCollectionResponse<ArticleType>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<ArticleType>(BASE_PATH, fields, {
      offset,
      limit,
      ...filters,
    });
  }

  /**
   * Get a single article type by ID
   * GET /api/v1/magazine/article-types/{articleTypeId}
   */
  async getArticleType(
    params: GetQueryByIdParams<ArticleType>,
  ): Promise<ArticleType> {
    return this.client.getById<ArticleType>(
      `${BASE_PATH}/${params.id}`,
      params.fields,
    );
  }

  /**
   * Create a new article type
   * POST /api/v1/magazine/article-types
   */
  async createArticleType(data: CreateArticleType): Promise<ArticleType> {
    return this.client.post<ArticleType>(BASE_PATH, data);
  }

  /**
   * Update an article type (full replacement)
   * PUT /api/v1/magazine/article-types/{articleTypeId}
   */
  async updateArticleType(
    articleTypeId: string,
    data: UpdateArticleType,
  ): Promise<ArticleType> {
    return this.client.put<ArticleType>(`${BASE_PATH}/${articleTypeId}`, data);
  }

  /**
   * Patch an article type (partial update)
   * PATCH /api/v1/magazine/article-types/{articleTypeId}
   */
  async patchArticleType(
    articleTypeId: string,
    data: Partial<UpdateArticleType>,
  ): Promise<ArticleType> {
    return this.client.patch<ArticleType>(
      `${BASE_PATH}/${articleTypeId}`,
      data,
    );
  }

  /**
   * Delete an article type
   * DELETE /api/v1/magazine/article-types/{articleTypeId}
   */
  async deleteArticleType(articleTypeId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${articleTypeId}`);
  }
}

import {
  Category,
  CreateCategory,
  UpdateCategory,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/magazine/categories';

export interface GetCategoriesFilter {
  parentId?: string;
  name?: string;
  term?: string;
}

export class CategoriesEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of categories
   * GET /api/v1/magazine/categories
   */
  async getCategories(
    params: GetCollectionQueryParams<Category> & { filters?: GetCategoriesFilter }
  ): Promise<ApiCollectionResponse<Category>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<Category>(BASE_PATH, fields, {
      offset,
      limit,
      ...filters,
    });
  }

  /**
   * Get a single category by ID
   * GET /api/v1/magazine/categories/{categoryId}
   */
  async getCategory(params: GetQueryByIdParams<Category>): Promise<Category> {
    return this.client.getById<Category>(
      `${BASE_PATH}/${params.id}`,
      params.fields
    );
  }

  /**
   * Create a new category
   * POST /api/v1/magazine/categories
   */
  async createCategory(data: CreateCategory): Promise<Category> {
    return this.client.post<Category>(BASE_PATH, data);
  }

  /**
   * Update a category (full replacement)
   * PUT /api/v1/magazine/categories/{categoryId}
   */
  async updateCategory(
    categoryId: string,
    data: UpdateCategory
  ): Promise<Category> {
    return this.client.put<Category>(`${BASE_PATH}/${categoryId}`, data);
  }

  /**
   * Patch a category (partial update)
   * PATCH /api/v1/magazine/categories/{categoryId}
   */
  async patchCategory(
    categoryId: string,
    data: Partial<UpdateCategory>
  ): Promise<Category> {
    return this.client.patch<Category>(`${BASE_PATH}/${categoryId}`, data);
  }

  /**
   * Delete a category
   * DELETE /api/v1/magazine/categories/{categoryId}
   */
  async deleteCategory(categoryId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${categoryId}`);
  }
}

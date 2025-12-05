import {
  Brand,
  CreateBrand,
  UpdateBrand,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/magazine/brands';

export interface GetBrandsFilter {
  is_active?: boolean;
  term?: string;
}

export class BrandsEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of brands
   * GET /api/v1/magazine/brands
   */
  async getBrands(
    params: GetCollectionQueryParams<Brand> & { filters?: GetBrandsFilter }
  ): Promise<ApiCollectionResponse<Brand>> {
    const { fields, offset, limit, filters } = params;
    
    return this.client.getCollection<Brand>(BASE_PATH, fields, {
      offset,
      limit,
      ...filters,
    });
  }

  /**
   * Get a single brand by ID
   * GET /api/v1/magazine/brands/{brandId}
   */
  async getBrand(params: GetQueryByIdParams<Brand>): Promise<Brand> {
    return this.client.getById<Brand>(
      `${BASE_PATH}/${params.id}`,
      params.fields
    );
  }

  /**
   * Create a new brand
   * POST /api/v1/magazine/brands
   */
  async createBrand(data: CreateBrand): Promise<Brand> {
    return this.client.post<Brand>(BASE_PATH, data);
  }

  /**
   * Update a brand (full replacement)
   * PUT /api/v1/magazine/brands/{brandId}
   */
  async updateBrand(brandId: string, data: UpdateBrand): Promise<Brand> {
    return this.client.put<Brand>(`${BASE_PATH}/${brandId}`, data);
  }

  /**
   * Patch a brand (partial update)
   * PATCH /api/v1/magazine/brands/{brandId}
   */
  async patchBrand(
    brandId: string,
    data: Partial<UpdateBrand>
  ): Promise<Brand> {
    return this.client.patch<Brand>(`${BASE_PATH}/${brandId}`, data);
  }

  /**
   * Delete a brand
   * DELETE /api/v1/magazine/brands/{brandId}
   */
  async deleteBrand(brandId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${brandId}`);
  }
}

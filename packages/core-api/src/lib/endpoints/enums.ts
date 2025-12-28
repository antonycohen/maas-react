import { Enum, CreateEnum, UpdateEnum } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/enums';

export interface GetEnumsFilter {
  organizationId?: string;
  name?: string;
  key?: string;
}

export class EnumsEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of enums
   * GET /api/v1/magazine/enums
   */
  async getEnums(
    params: GetCollectionQueryParams<Enum> & { filters?: GetEnumsFilter }
  ): Promise<ApiCollectionResponse<Enum>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<Enum>(BASE_PATH, fields, {
      offset,
      limit,
      ...filters,
    });
  }

  /**
   * Get a single enum by ID
   * GET /api/v1/magazine/enums/{enumId}
   */
  async getEnum(params: GetQueryByIdParams<Enum>): Promise<Enum> {
    return this.client.getById<Enum>(`${BASE_PATH}/${params.id}`, params.fields);
  }

  /**
   * Create a new enum
   * POST /api/v1/magazine/enums
   */
  async createEnum(data: CreateEnum): Promise<Enum> {
    return this.client.post<Enum>(BASE_PATH, data);
  }

  /**
   * Update an enum (full replacement)
   * PUT /api/v1/magazine/enums/{enumId}
   */
  async updateEnum(enumId: string, data: UpdateEnum): Promise<Enum> {
    return this.client.put<Enum>(`${BASE_PATH}/${enumId}`, data);
  }

  /**
   * Patch an enum (partial update)
   * PATCH /api/v1/magazine/enums/{enumId}
   */
  async patchEnum(enumId: string, data: Partial<UpdateEnum>): Promise<Enum> {
    return this.client.patch<Enum>(`${BASE_PATH}/${enumId}`, data);
  }

  /**
   * Delete an enum
   * DELETE /api/v1/magazine/enums/{enumId}
   */
  async deleteEnum(enumId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${enumId}`);
  }
}

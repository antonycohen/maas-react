import { Price, CreatePrice, UpdatePrice, PriceInterval, PriceUsageType } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/prices';

export interface GetPricesFilter {
    productId?: string;
    currency?: string;
    active?: boolean;
    recurringInterval?: PriceInterval;
    recurringUsageType?: PriceUsageType;
}

export class PricesEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of prices
     * GET /api/v1/pms/prices
     */
    async getPrices(
        params: GetCollectionQueryParams<Price> & { filters?: GetPricesFilter }
    ): Promise<ApiCollectionResponse<Price>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Price>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.productId && { productId: filters.productId }),
            ...(filters?.currency && { currency: filters.currency }),
            ...(filters?.active !== undefined && { active: filters.active }),
            ...(filters?.recurringInterval && { recurringInterval: filters.recurringInterval }),
            ...(filters?.recurringUsageType && { recurringUsageType: filters.recurringUsageType }),
        });
    }

    /**
     * Get a single price by ID
     * GET /api/v1/pms/prices/{priceId}
     */
    async getPrice(params: GetQueryByIdParams<Price>): Promise<Price> {
        return this.client.getById<Price>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new price
     * POST /api/v1/pms/prices
     */
    async createPrice(data: CreatePrice): Promise<Price> {
        return this.client.post<Price>(BASE_PATH, data);
    }

    /**
     * Update a price
     * PUT /api/v1/pms/prices/{priceId}
     */
    async updatePrice(priceId: string, data: UpdatePrice): Promise<Price> {
        return this.client.put<Price>(`${BASE_PATH}/${priceId}`, data);
    }

    /**
     * Delete a price
     * DELETE /api/v1/pms/prices/{priceId}
     */
    async deletePrice(priceId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${priceId}`);
    }

    /**
     * Sync a price from Stripe
     * POST /api/v1/pms/prices/{priceId}/sync
     */
    async syncPrice(priceId: string): Promise<Price> {
        return this.client.post<Price>(`${BASE_PATH}/${priceId}/sync`, {});
    }
}

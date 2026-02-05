import { Product, CreateProduct, UpdateProduct, Feature } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/products';

export interface GetProductsFilter {
    planId?: string;
    name?: string;
    active?: boolean;
    type?: string;
}

export class ProductsEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of products
     * GET /api/v1/pms/products
     */
    async getProducts(
        params: GetCollectionQueryParams<Product> & { filters?: GetProductsFilter }
    ): Promise<ApiCollectionResponse<Product>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Product>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.planId && { planId: filters.planId }),
            ...(filters?.name && { name: filters.name }),
            ...(filters?.active !== undefined && { active: filters.active }),
            ...(filters?.type && { type: filters.type }),
        });
    }

    /**
     * Get a single product by ID
     * GET /api/v1/pms/products/{productId}
     */
    async getProduct(params: GetQueryByIdParams<Product>): Promise<Product> {
        return this.client.getById<Product>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new product
     * POST /api/v1/pms/products
     */
    async createProduct(data: CreateProduct): Promise<Product> {
        return this.client.post<Product>(BASE_PATH, data);
    }

    /**
     * Update a product
     * PUT /api/v1/pms/products/{productId}
     */
    async updateProduct(productId: string, data: UpdateProduct): Promise<Product> {
        return this.client.put<Product>(`${BASE_PATH}/${productId}`, data);
    }

    /**
     * Delete a product
     * DELETE /api/v1/pms/products/{productId}
     */
    async deleteProduct(productId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${productId}`);
    }

    /**
     * Get features attached to a product
     * GET /api/v1/pms/products/{productId}/features
     */
    async getProductFeatures(productId: string): Promise<Feature[]> {
        return this.client.getById<Feature[]>(`${BASE_PATH}/${productId}/features`);
    }

    /**
     * Attach a feature to a product
     * POST /api/v1/pms/products/{productId}/features/{featureId}
     */
    async attachFeature(productId: string, featureId: string): Promise<{ id: string }> {
        return this.client.post<{ id: string }>(`${BASE_PATH}/${productId}/features/${featureId}`, {});
    }

    /**
     * Detach a feature from a product
     * DELETE /api/v1/pms/products/{productId}/features/{productFeatureId}
     */
    async detachFeature(productId: string, productFeatureId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${productId}/features/${productFeatureId}`);
    }

    /**
     * Sync a product from Stripe
     * POST /api/v1/pms/products/{productId}/sync
     */
    async syncProduct(productId: string): Promise<Product> {
        return this.client.post<Product>(`${BASE_PATH}/${productId}/sync`, {});
    }
}

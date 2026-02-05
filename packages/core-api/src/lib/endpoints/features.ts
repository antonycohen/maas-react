import { Feature, CreateFeature, UpdateFeature } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/features';

export interface GetFeaturesFilter {
    lookupKey?: string;
    displayName?: string;
    withQuota?: boolean;
}

export class FeaturesEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of features
     * GET /api/v1/pms/features
     */
    async getFeatures(
        params: GetCollectionQueryParams<Feature> & { filters?: GetFeaturesFilter }
    ): Promise<ApiCollectionResponse<Feature>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Feature>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.lookupKey && { lookupKey: filters.lookupKey }),
            ...(filters?.displayName && { displayName: filters.displayName }),
            ...(filters?.withQuota !== undefined && { withQuota: filters.withQuota }),
        });
    }

    /**
     * Get a single feature by ID
     * GET /api/v1/pms/features/{featureId}
     */
    async getFeature(params: GetQueryByIdParams<Feature>): Promise<Feature> {
        return this.client.getById<Feature>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new feature
     * POST /api/v1/pms/features
     */
    async createFeature(data: CreateFeature): Promise<Feature> {
        return this.client.post<Feature>(BASE_PATH, data);
    }

    /**
     * Update a feature
     * PUT /api/v1/pms/features/{featureId}
     */
    async updateFeature(featureId: string, data: UpdateFeature): Promise<Feature> {
        return this.client.put<Feature>(`${BASE_PATH}/${featureId}`, data);
    }

    /**
     * Delete a feature
     * DELETE /api/v1/pms/features/{featureId}
     */
    async deleteFeature(featureId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${featureId}`);
    }

    /**
     * Sync a feature from Stripe
     * POST /api/v1/pms/features/sync/{lookupKey}
     */
    async syncFeature(lookupKey: string): Promise<Feature> {
        return this.client.post<Feature>(`${BASE_PATH}/sync/${lookupKey}`, {});
    }
}

import { Plan, CreatePlan, UpdatePlan } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/plans';

export interface GetPlansFilter {
    name?: string;
    active?: boolean;
}

export class PlansEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of plans
     * GET /api/v1/pms/plans
     */
    async getPlans(
        params: GetCollectionQueryParams<Plan> & { filters?: GetPlansFilter }
    ): Promise<ApiCollectionResponse<Plan>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Plan>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.name && { name: filters.name }),
            ...(filters?.active !== undefined && { active: filters.active }),
        });
    }

    /**
     * Get a single plan by ID
     * GET /api/v1/pms/plans/{planId}
     */
    async getPlan(params: GetQueryByIdParams<Plan>): Promise<Plan> {
        return this.client.getById<Plan>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new plan
     * POST /api/v1/pms/plans
     */
    async createPlan(data: CreatePlan): Promise<Plan> {
        return this.client.post<Plan>(BASE_PATH, data);
    }

    /**
     * Update a plan
     * PUT /api/v1/pms/plans/{planId}
     */
    async updatePlan(planId: string, data: UpdatePlan): Promise<Plan> {
        return this.client.put<Plan>(`${BASE_PATH}/${planId}`, data);
    }

    /**
     * Delete a plan
     * DELETE /api/v1/pms/plans/{planId}
     */
    async deletePlan(planId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${planId}`);
    }
}

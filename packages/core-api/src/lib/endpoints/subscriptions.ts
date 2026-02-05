import { Subscription, SubscriptionStatus } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/subscriptions';

export interface GetSubscriptionsFilter {
    customerId?: string;
    planId?: string;
    status?: SubscriptionStatus;
    refType?: string;
    refId?: string;
}

export class SubscriptionsEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of subscriptions
     * GET /api/v1/pms/subscriptions
     */
    async getSubscriptions(
        params: GetCollectionQueryParams<Subscription> & { filters?: GetSubscriptionsFilter }
    ): Promise<ApiCollectionResponse<Subscription>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Subscription>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.customerId && { customerId: filters.customerId }),
            ...(filters?.planId && { planId: filters.planId }),
            ...(filters?.status && { status: filters.status }),
            ...(filters?.refType && { refType: filters.refType }),
            ...(filters?.refId && { refId: filters.refId }),
        });
    }

    /**
     * Get a single subscription by ID
     * GET /api/v1/pms/subscriptions/{subscriptionId}
     */
    async getSubscription(params: GetQueryByIdParams<Subscription>): Promise<Subscription> {
        return this.client.getById<Subscription>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Cancel a subscription at period end
     * POST /api/v1/pms/subscriptions/{subscriptionId}/cancel
     */
    async cancelSubscriptionAtPeriodEnd(subscriptionId: string): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/cancel`, {});
    }

    /**
     * Cancel a subscription immediately
     * POST /api/v1/pms/subscriptions/{subscriptionId}/cancel-immediately
     */
    async cancelSubscriptionImmediately(subscriptionId: string): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/cancel-immediately`, {});
    }

    /**
     * Resume a subscription
     * POST /api/v1/pms/subscriptions/{subscriptionId}/resume
     */
    async resumeSubscription(subscriptionId: string): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/resume`, {});
    }

    /**
     * Sync a subscription from Stripe
     * POST /api/v1/pms/subscriptions/{subscriptionId}/sync
     */
    async syncSubscription(subscriptionId: string): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/sync`, {});
    }
}

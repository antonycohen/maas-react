import { Subscription, SubscriptionStatus } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, FieldQuery, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/subscriptions';
const ME_PATH = '/api/v1/users/me';

export interface GetSubscriptionsFilter {
    customerId?: string;
    planId?: string;
    status?: SubscriptionStatus;
    refType?: string;
    refId?: string;
}

export interface MySubscriptionStatus {
    isSubscribed: boolean;
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
     * Renew a subscription
     * POST /api/v1/pms/subscriptions/{subscriptionId}/renew
     */
    async renewSubscription(subscriptionId: string, data?: { paymentMethod?: string }): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/renew`, data ?? {});
    }

    /**
     * Upgrade/change a subscription
     * POST /api/v1/pms/subscriptions/{subscriptionId}/upgrade
     */
    async upgradeSubscription(
        subscriptionId: string,
        data: { priceIds: string[]; paymentMethod?: string; daysUntilDue?: number; metadata?: Record<string, unknown> }
    ): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/upgrade`, data);
    }

    /**
     * Sync a subscription from Stripe
     * POST /api/v1/pms/subscriptions/{subscriptionId}/sync
     */
    async syncSubscription(subscriptionId: string): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${subscriptionId}/sync`, {});
    }

    /**
     * Get the current user's subscription
     * GET /api/v1/users/me/subscription
     */
    async getMySubscription(fields?: FieldQuery<Subscription>): Promise<Subscription> {
        return this.client.getById<Subscription>(`${ME_PATH}/subscription`, fields);
    }

    /**
     * Check if the current user has an active subscription
     * GET /api/v1/users/me/subscription/status
     */
    async getMySubscriptionStatus(): Promise<MySubscriptionStatus> {
        return this.client.getById<MySubscriptionStatus>(`${ME_PATH}/subscription/status`);
    }
}

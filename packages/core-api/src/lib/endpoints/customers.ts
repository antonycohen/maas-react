import { ReadCustomer, CreateCustomer, TaxExempt, Quota, Subscription } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, FieldQuery, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/customers';
const ME_PATH = '/api/v1/users/me';

export interface BillingAddress {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface UpdateMyCustomerData {
    name?: string;
    email?: string;
    phone?: string | null;
    description?: string | null;
    currency?: string | null;
    billingAddress?: BillingAddress;
    shippingAddress?: ShippingAddress;
}

export interface UpdateQuotaUsageData {
    featureKey: string;
    amount: number;
    operation: 'consume' | 'add';
    description?: string;
}

export interface CreateCustomerSubscriptionData {
    priceIds: string[];
    collectionMethod: 'send_invoice' | 'charge_automatically';
    daysUntilDue?: number;
    metadata?: Record<string, unknown>;
}

export interface GetCustomersFilter {
    query?: string;
    email?: string;
    name?: string;
    refType?: string;
    refId?: string;
    taxExempt?: TaxExempt;
    delinquent?: boolean;
}

export class CustomersEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of customers
     * GET /api/v1/pms/customers
     */
    async getCustomers(
        params: GetCollectionQueryParams<ReadCustomer> & { filters?: GetCustomersFilter }
    ): Promise<ApiCollectionResponse<ReadCustomer>> {
        const { fields, offset, limit, filters, sort } = params;
        return this.client.getCollection<ReadCustomer>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.query && { query: filters.query }),
            ...(filters?.email && { email: filters.email }),
            ...(filters?.name && { name: filters.name }),
            ...(filters?.refType && { refType: filters.refType }),
            ...(filters?.refId && { refId: filters.refId }),
            ...(filters?.taxExempt && { taxExempt: filters.taxExempt }),
            ...(filters?.delinquent !== undefined && { delinquent: filters.delinquent }),
            ...(sort && { sortKey: sort.field, sortDirection: sort.direction }),
        });
    }

    /**
     * Get a single customer by ID
     * GET /api/v1/pms/customers/{customerId}
     */
    async getCustomer(params: GetQueryByIdParams<ReadCustomer>): Promise<ReadCustomer> {
        return this.client.getById<ReadCustomer>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Get the current user's customer
     * GET /api/v1/users/me/customer
     */
    async getMyCustomer(fields?: FieldQuery<ReadCustomer>): Promise<ReadCustomer> {
        return this.client.getById<ReadCustomer>(`${ME_PATH}/customer`, fields);
    }

    /**
     * Update the current user's customer
     * PATCH /api/v1/pms/customers/me
     */
    async updateMyCustomer(data: UpdateMyCustomerData): Promise<ReadCustomer> {
        return this.client.put<ReadCustomer>(`${BASE_PATH}/me`, data);
    }

    /**
     * Create a new customer
     * POST /api/v1/pms/customers
     */
    async createCustomer(data: CreateCustomer): Promise<ReadCustomer> {
        return this.client.post<ReadCustomer>(BASE_PATH, data);
    }

    /**
     * Update a customer by ID
     * PUT /api/v1/pms/customers/{customerId}
     */
    async updateCustomer(customerId: string, data: UpdateMyCustomerData): Promise<ReadCustomer> {
        return this.client.patch<ReadCustomer>(`${BASE_PATH}/${customerId}`, data);
    }

    /**
     * Get the current user's quotas
     * GET /api/v1/users/me/quotas
     */
    async getMyQuotas(): Promise<Quota[]> {
        return this.client.getById<Quota[]>(`${ME_PATH}/quotas`);
    }

    /**
     * Get a customer's quotas
     * GET /api/v1/pms/customers/{customerId}/quotas
     */
    async getCustomerQuotas(customerId: string): Promise<Quota[]> {
        return this.client.getById<Quota[]>(`${BASE_PATH}/${customerId}/quotas`);
    }

    /**
     * Update quota usage for a customer
     * POST /api/v1/pms/customers/{customerId}/quotas/usage
     */
    async updateQuotaUsage(customerId: string, data: UpdateQuotaUsageData): Promise<Quota> {
        return this.client.post<Quota>(`${BASE_PATH}/${customerId}/quotas/usage`, data);
    }

    /**
     * Create a subscription for a customer (admin)
     * POST /api/v1/pms/customers/{customerId}/subscriptions
     */
    async createCustomerSubscription(customerId: string, data: CreateCustomerSubscriptionData): Promise<Subscription> {
        return this.client.post<Subscription>(`${BASE_PATH}/${customerId}/subscriptions`, data);
    }
}

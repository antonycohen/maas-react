import { ReadCustomer, TaxExempt, Quota } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, FieldQuery, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/pms/customers';
const ME_PATH = '/api/v1/users/me';

export interface GetCustomersFilter {
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
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<ReadCustomer>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.email && { email: filters.email }),
            ...(filters?.name && { name: filters.name }),
            ...(filters?.refType && { refType: filters.refType }),
            ...(filters?.refId && { refId: filters.refId }),
            ...(filters?.taxExempt && { taxExempt: filters.taxExempt }),
            ...(filters?.delinquent !== undefined && { delinquent: filters.delinquent }),
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
     * Get the current user's quotas
     * GET /api/v1/users/me/quotas
     */
    async getMyQuotas(): Promise<Quota[]> {
        return this.client.getById<Quota[]>(`${ME_PATH}/quotas`);
    }
}

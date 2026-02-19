import { Organization } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

export class OrganizationsEndpoint {
    constructor(private client: ApiClient) {}

    async getOrganization(params: GetQueryByIdParams<Organization>): Promise<Organization> {
        return this.client.getById<Organization>(`/api/v1/organizations/${params.id}`, params.fields);
    }

    async getOrganizations(
        params: GetCollectionQueryParams<Organization>
    ): Promise<ApiCollectionResponse<Organization>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Organization>(`/api/v1/organizations`, fields, {
            offset,
            limit,
            ...filters,
        });
    }

    async getUserOrganizations(
        userId: string,
        params: GetCollectionQueryParams<Organization>
    ): Promise<ApiCollectionResponse<Organization>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Organization>(`/api/v1/users/${userId}/organizations`, fields, {
            offset,
            limit,
            ...filters,
        });
    }
}

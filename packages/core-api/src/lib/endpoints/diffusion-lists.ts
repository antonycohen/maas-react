import {
    DiffusionList,
    CreateDiffusionList,
    UpdateDiffusionList,
    DiffusionListEntry,
    CreateDiffusionListEntry,
    ReadCustomer,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

export interface GetDiffusionListsFilter {
    status?: string;
    type?: string;
    term?: string;
}

export interface GetDiffusionListsStaticParams {
    organizationId: string;
}

export interface GetDiffusionListEntriesFilter {
    query?: string;
    isManual?: boolean;
}

export interface GetDiffusionListEntriesStaticParams {
    diffusionListId: string;
}

export class DiffusionListsEndpoint {
    constructor(private client: ApiClient) {}

    async getDiffusionLists(
        params: GetCollectionQueryParams<DiffusionList, GetDiffusionListsStaticParams> & {
            filters?: GetDiffusionListsFilter;
            organizationId?: string;
        }
    ): Promise<ApiCollectionResponse<DiffusionList>> {
        const { staticParams, fields, sort, offset = 0, limit = 20, filters, organizationId } = params;
        const orgId = staticParams?.organizationId ?? organizationId;
        if (!orgId) throw new Error('organizationId is required');
        return this.client.getCollection<DiffusionList>(`/api/v1/organizations/${orgId}/diffusion-lists`, fields, {
            offset,
            limit,
            ...filters,
            sort,
        });
    }

    async getDiffusionList(params: GetQueryByIdParams<DiffusionList>): Promise<DiffusionList> {
        return this.client.getById<DiffusionList>(`/api/v1/diffusion-lists/${params.id}`, params.fields);
    }

    async createDiffusionList(organizationId: string, data: CreateDiffusionList): Promise<DiffusionList> {
        return this.client.post<DiffusionList>(`/api/v1/organizations/${organizationId}/diffusion-lists`, data);
    }

    async updateDiffusionList(id: string, data: UpdateDiffusionList): Promise<DiffusionList> {
        return this.client.put<DiffusionList>(`/api/v1/diffusion-lists/${id}`, data);
    }

    async deleteDiffusionList(id: string): Promise<void> {
        return this.client.delete<void>(`/api/v1/diffusion-lists/${id}`);
    }

    async populateDiffusionList(id: string): Promise<DiffusionListEntry[]> {
        return this.client.post<DiffusionListEntry[]>(`/api/v1/diffusion-lists/${id}/populate`);
    }

    async confirmDiffusionList(id: string): Promise<DiffusionList> {
        return this.client.post<DiffusionList>(`/api/v1/diffusion-lists/${id}/confirm`);
    }

    async revertDiffusionListToDraft(id: string): Promise<DiffusionList> {
        return this.client.post<DiffusionList>(`/api/v1/diffusion-lists/${id}/revert-to-draft`);
    }

    async generateDiffusionList(id: string): Promise<DiffusionList> {
        return this.client.post<DiffusionList>(`/api/v1/diffusion-lists/${id}/generate`);
    }

    async getDiffusionListEntries(
        params: GetCollectionQueryParams<DiffusionListEntry, GetDiffusionListEntriesStaticParams> & {
            filters?: GetDiffusionListEntriesFilter;
            diffusionListId?: string;
        }
    ): Promise<ApiCollectionResponse<DiffusionListEntry>> {
        const { staticParams, fields, sort, offset = 0, limit = 20, filters, diffusionListId } = params;
        const listId = staticParams?.diffusionListId ?? diffusionListId;
        if (!listId) throw new Error('diffusionListId is required');
        return this.client.getCollection<DiffusionListEntry>(`/api/v1/diffusion-lists/${listId}/entries`, fields, {
            offset,
            limit,
            ...filters,
            sort,
        });
    }

    async getAvailableCustomers(
        id: string,
        params: { query?: string; offset?: number; limit?: number }
    ): Promise<ApiCollectionResponse<ReadCustomer>> {
        const { query, offset = 0, limit = 20 } = params;
        return this.client.getCollection<ReadCustomer>(`/api/v1/diffusion-lists/${id}/available-customers`, undefined, {
            offset,
            limit,
            query,
        });
    }

    async addDiffusionListEntry(id: string, data: CreateDiffusionListEntry): Promise<DiffusionListEntry> {
        return this.client.post<DiffusionListEntry>(`/api/v1/diffusion-lists/${id}/entries`, data);
    }

    async removeDiffusionListEntry(id: string, entryId: string): Promise<void> {
        return this.client.delete<void>(`/api/v1/diffusion-lists/${id}/entries/${entryId}`);
    }

    async downloadDiffusionList(id: string): Promise<{ url: string }> {
        return this.client.getById<{ url: string }>(`/api/v1/diffusion-lists/${id}/download`);
    }
}

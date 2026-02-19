import { Folder, CreateFolder, UpdateFolder } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

const BASE_PATH = '/api/v1/magazine/folders';

export interface GetFoldersFilter {
    issueId?: string;
    term?: string;
    id?: string | string[];
    name?: string;
    isPublished?: boolean;
}

export class FoldersEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get a list of folders
     * GET /api/v1/magazine/folders
     */
    async getFolders(
        params: GetCollectionQueryParams<Folder> & { filters?: GetFoldersFilter }
    ): Promise<ApiCollectionResponse<Folder>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<Folder>(BASE_PATH, fields, {
            offset,
            limit,
            ...(filters?.issueId && { issue_id: filters.issueId }),
            ...(filters?.name && { name: filters.name }),
            ...(filters?.isPublished !== undefined && { is_published: filters.isPublished }),
        });
    }

    /**
     * Get a single folder by ID
     * GET /api/v1/magazine/folders/{folderId}
     */
    async getFolder(params: GetQueryByIdParams<Folder>): Promise<Folder> {
        return this.client.getById<Folder>(`${BASE_PATH}/${params.id}`, params.fields);
    }

    /**
     * Create a new folder
     * POST /api/v1/magazine/folders
     */
    async createFolder(data: CreateFolder): Promise<Folder> {
        return this.client.post<Folder>(BASE_PATH, data);
    }

    /**
     * Update a folder (full replacement)
     * PUT /api/v1/magazine/folders/{folderId}
     */
    async updateFolder(folderId: string, data: UpdateFolder): Promise<Folder> {
        return this.client.put<Folder>(`${BASE_PATH}/${folderId}`, data);
    }

    /**
     * Patch a folder (partial update)
     * PATCH /api/v1/magazine/folders/{folderId}
     */
    async patchFolder(folderId: string, data: Partial<UpdateFolder>): Promise<Folder> {
        return this.client.patch<Folder>(`${BASE_PATH}/${folderId}`, data);
    }

    /**
     * Delete a folder
     * DELETE /api/v1/magazine/folders/{folderId}
     */
    async deleteFolder(folderId: string): Promise<void> {
        return this.client.delete<void>(`${BASE_PATH}/${folderId}`);
    }
}

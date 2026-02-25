import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/permissions';

export interface AvailablePermissionsResponse {
    permissions: string[];
}

export interface PermissionAlias {
    id: string;
    permissions: string[];
}

export interface CreatePermissionAliasData {
    id: string;
    permissions: string[];
}

export interface AssignAliasToUserData {
    permissions_alias: { id: string };
    user: { id: string };
}

export interface UserPermissionsResponse {
    permissions: string[];
}

export class PermissionsEndpoint {
    constructor(private client: ApiClient) {}

    /** GET /api/v1/permissions/available */
    async getAvailablePermissions(): Promise<AvailablePermissionsResponse> {
        return this.client.getById<AvailablePermissionsResponse>(`${BASE_PATH}/available`);
    }

    /** GET /api/v1/permissions/alias */
    async getAliases(): Promise<PermissionAlias[]> {
        return this.client.getById<PermissionAlias[]>(`${BASE_PATH}/alias`);
    }

    /** POST /api/v1/permissions/alias */
    async createAlias(data: CreatePermissionAliasData): Promise<PermissionAlias> {
        return this.client.post<PermissionAlias>(`${BASE_PATH}/alias`, data);
    }

    /** PUT /api/v1/permissions/alias */
    async updateAlias(data: CreatePermissionAliasData): Promise<PermissionAlias> {
        return this.client.put<PermissionAlias>(`${BASE_PATH}/alias`, data);
    }

    /** POST /api/v1/permissions — assign alias to user */
    async assignAliasToUser(data: AssignAliasToUserData): Promise<void> {
        return this.client.post<void>(BASE_PATH, data);
    }

    /** GET /api/v1/permissions/me */
    async getMyPermissions(): Promise<UserPermissionsResponse> {
        return this.client.getById<UserPermissionsResponse>(`${BASE_PATH}/me`);
    }
}

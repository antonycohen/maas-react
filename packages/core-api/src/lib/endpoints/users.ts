import {
    ChangeEmailRequest,
    ChangePasswordRequest,
    CreateUser,
    UpdateLocalizationPreferences,
    UpdateNotificationsPreferences,
    UpdateUserInfo,
    User,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

export class UsersEndpoint {
    constructor(private client: ApiClient) {}

    async createUser(data: CreateUser): Promise<User> {
        return this.client.post<User>('/api/v1/users', data);
    }

    async getUser(params: GetQueryByIdParams<User>): Promise<User> {
        const response = this.client.getById<User>(`/api/v1/users/${params.id}`, params.fields);

        return response;
    }

    async getUsers(params: GetCollectionQueryParams<User>): Promise<ApiCollectionResponse<User>> {
        const { fields, offset, limit, filters } = params;
        return this.client.getCollection<User>('/api/v1/users', fields, {
            offset,
            limit,
            ...filters,
        });
    }

    async updateUser(
        userId: string,
        updates: UpdateUserInfo | UpdateLocalizationPreferences | UpdateNotificationsPreferences
    ): Promise<User> {
        return this.client.patch<User>(`/api/v1/users/${userId}`, updates);
    }

    async changeEmail(userId: string, body: ChangeEmailRequest): Promise<void> {
        return this.client.post<void>(`/api/v1/users/${userId}/change-email-request`, body);
    }

    async changePassword(userId: string, body: ChangePasswordRequest): Promise<void> {
        return this.client.post<void>(`/api/v1/users/${userId}/change-password-request`, body);
    }

    async deleteUser(userId: string): Promise<void> {
        return this.client.delete<void>(`/api/v1/users/${userId}`);
    }

    async banUser(userId: string): Promise<User> {
        return this.client.post<User>(`/api/v1/users/${userId}/ban`, {});
    }

    async unbanUser(userId: string): Promise<User> {
        return this.client.post<User>(`/api/v1/users/${userId}/unban`, {});
    }

    async sendResetPasswordLink(userId: string): Promise<void> {
        return this.client.post<void>(`/api/v1/users/${userId}/reset-password-request`, {});
    }
}

import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  UpdateLocalizationPreferences,
  UpdateNotificationsPreferences,
  UpdateUserInfo,
  User
} from '@maas/core-api-models';
import {ApiClient} from '../api-client/api-client';
import {ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams} from '../types';


export class UsersEndpoint {
  constructor(private client: ApiClient) {}

  async getUser(params: GetQueryByIdParams<User>): Promise<User> {
    const response = this.client.getById<User>(`/api/v1/users/${params.id}`, params.fields);

    console.log(response);
    return response;
  }

  async getUsers(params: GetCollectionQueryParams<User>): Promise<ApiCollectionResponse<User>> {
    const { fields, offset, limit, filters } = params;
    return this.client.getCollection<User>('/api/v1/users', fields, {
      offset,
      limit,
      ...filters
    });
  }

  async updateUser(userId: string, updates: UpdateUserInfo | UpdateLocalizationPreferences | UpdateNotificationsPreferences): Promise<User> {
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
}

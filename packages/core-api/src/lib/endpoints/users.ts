import { User } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, GetCollectionQueryParams, GetQueryByIdParams } from '../types';

export interface UpdateUserBody {
  firstName?: User['firstName'];
  lastName?: User['lastName'];
  profileImage?: User['profileImage'];
  phoneNumber?: User['phoneNumber'];
  locale?: User['locale'];
}

export interface ChangeEmailRequestBody {
  newEmail: string;
}

export interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

export interface GetUsersFilter {
  terms?: string;
  roles?: string[];
}

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

  async updateUser(userId: string, updates: UpdateUserBody): Promise<User> {
    return this.client.patch<User>(`/api/v1/users/${userId}`, updates);
  }

  async changeEmail(body: ChangeEmailRequestBody): Promise<void> {
    return this.client.post<void>('/api/v1/users/me/change-email', body);
  }

  async changePassword(body: ChangePasswordRequestBody): Promise<void> {
    return this.client.post<void>('/api/v1/users/me/change-password', body);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}`);
  }
}

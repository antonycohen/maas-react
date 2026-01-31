import {
  Issue,
  CreateIssue,
  UpdateIssue,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import {
  ApiCollectionResponse,
  GetCollectionQueryParams,
  GetQueryByIdParams,
} from '../types';

const BASE_PATH = '/api/v1/magazine/issues';

export interface GetIssuesFilter {
  brandId?: string;
  title?: string;
  term?: string;
  isPublished?: boolean;
}

export class IssuesEndpoint {
  constructor(private client: ApiClient) {}

  /**
   * Get a list of issues
   * GET /api/v1/magazine/issues
   */
  async getIssues(
    params: GetCollectionQueryParams<Issue> & { filters?: GetIssuesFilter }
  ): Promise<ApiCollectionResponse<Issue>> {
    const { fields, offset, limit, filters, staticParams } = params;
    return this.client.getCollection<Issue>(BASE_PATH, fields, {
      offset,
      limit,
      ...{ ...filters, ...staticParams as GetCollectionQueryParams<Issue>['filters'] },
    });
  }

  /**
   * Get a single issue by ID
   * GET /api/v1/magazine/issues/{issueId}
   */
  async getIssue(params: GetQueryByIdParams<Issue>): Promise<Issue> {
    return this.client.getById<Issue>(
      `${BASE_PATH}/${params.id}`,
      params.fields
    );
  }

  /**
   * Create a new issue
   * POST /api/v1/magazine/issues
   */
  async createIssue(data: CreateIssue): Promise<Issue> {
    return this.client.post<Issue>(BASE_PATH, data);
  }

  /**
   * Update an issue (full replacement)
   * PUT /api/v1/magazine/issues/{issueId}
   */
  async updateIssue(
    issueId: string,
    data: UpdateIssue
  ): Promise<Issue> {
    return this.client.put<Issue>(`${BASE_PATH}/${issueId}`, data);
  }

  /**
   * Patch an issue (partial update)
   * PATCH /api/v1/magazine/issues/{issueId}
   */
  async patchIssue(
    issueId: string,
    data: Partial<UpdateIssue>
  ): Promise<Issue> {
    return this.client.patch<Issue>(`${BASE_PATH}/${issueId}`, data);
  }

  /**
   * Delete an issue
   * DELETE /api/v1/magazine/issues/{issueId}
   */
  async deleteIssue(issueId: string): Promise<void> {
    return this.client.delete<void>(`${BASE_PATH}/${issueId}`);
  }
}

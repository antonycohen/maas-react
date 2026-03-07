import { ReadComment, CreateComment } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';
import { ApiCollectionResponse, FieldQuery } from '../types';

export class CommentsEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get comments for a resource
     * GET /api/v1/{resource}/{refId}/comments
     */
    async getResourceComments(
        resource: string,
        refId: string,
        fields?: FieldQuery<ReadComment>,
        query?: { offset?: number; limit?: number; sort_direction?: string }
    ): Promise<ApiCollectionResponse<ReadComment>> {
        return this.client.getCollection<ReadComment>(`/api/v1/${resource}/${refId}/comments`, fields, query);
    }

    /**
     * Create a comment
     * POST /api/v1/comments
     */
    async createComment(data: CreateComment): Promise<ReadComment> {
        return this.client.post<ReadComment>('/api/v1/comments', data);
    }

    /**
     * Delete a comment
     * DELETE /api/v1/comments/{commentId}
     */
    async deleteComment(commentId: string): Promise<void> {
        return this.client.delete<void>(`/api/v1/comments/${commentId}`);
    }
}

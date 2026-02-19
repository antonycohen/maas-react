import { SearchResponse } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/magazine/search';

export class SearchEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Global search across articles, issues, and folders
     * GET /api/v1/magazine/search?term=...
     */
    async search(term: string): Promise<SearchResponse> {
        const response = await this.client.request<SearchResponse>(BASE_PATH, {
            method: 'GET',
            params: { term },
        });
        return response.data;
    }
}

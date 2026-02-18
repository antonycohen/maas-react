import { HomepageResponse } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/homepage';

export interface GetHomepageParams {
    issueFields?: string;
    articleFields?: string;
    categoriesSlugs?: string[];
}

export class HomepageEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get homepage data (latest issue + category articles)
     * GET /api/v1/homepage
     */
    async getHomepage(params?: GetHomepageParams): Promise<HomepageResponse> {
        return this.client.getById<HomepageResponse>(BASE_PATH, undefined, {
            params: {
                ...(params?.issueFields && { issue_fields: params.issueFields }),
                ...(params?.articleFields && { article_fields: params.articleFields }),
                ...(params?.categoriesSlugs && { categories_slug: params.categoriesSlugs.join(',') }),
            },
        });
    }
}

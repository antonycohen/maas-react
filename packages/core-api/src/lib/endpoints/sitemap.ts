import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/sitemap';

export interface SitemapData {
    articles: string[];
    issues: string[];
    folders: string[];
    categories: { slug: string }[];
    themes: string[];
}

export class SitemapEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get sitemap data (cached by backend in Redis)
     * GET /api/v1/sitemap
     */
    async getSitemap(): Promise<SitemapData> {
        return this.client.getById<SitemapData>(BASE_PATH);
    }
}

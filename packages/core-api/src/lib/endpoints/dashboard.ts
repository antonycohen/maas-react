import { DashboardStats } from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/pms/dashboard';

export interface GetDashboardParams {
    dateFrom?: string;
    dateTo?: string;
    forceReload?: boolean;
}

interface DashboardResponse {
    dashboard: DashboardStats;
}

export class DashboardEndpoint {
    constructor(private client: ApiClient) {}

    /**
     * Get dashboard stats
     * GET /api/v1/pms/dashboard
     */
    async getDashboard(params?: GetDashboardParams): Promise<DashboardStats> {
        const response = await this.client.getById<DashboardResponse>(BASE_PATH, undefined, {
            params: {
                ...(params?.dateFrom && { dateFrom: params.dateFrom }),
                ...(params?.dateTo && { dateTo: params.dateTo }),
                ...(params?.forceReload && { forceReload: params.forceReload }),
            },
        });
        return response.dashboard;
    }
}

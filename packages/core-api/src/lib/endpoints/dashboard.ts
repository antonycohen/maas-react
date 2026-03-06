import {
    DashboardOverview,
    DashboardSubscriptionModule,
    DashboardContentModule,
    DashboardMagazineModule,
    DashboardDiffusionModule,
    DashboardSubscribersModule,
} from '@maas/core-api-models';
import { ApiClient } from '../api-client/api-client';

const BASE_PATH = '/api/v1/dashboard';

export interface GetDashboardParams {
    dateFrom?: string;
    dateTo?: string;
    forceReload?: boolean;
}

interface DashboardResponse<T> {
    dashboard: T;
}

export class DashboardEndpoint {
    constructor(private client: ApiClient) {}

    async getDashboard(params?: GetDashboardParams): Promise<DashboardOverview> {
        const response = await this.client.getById<DashboardResponse<DashboardOverview>>(BASE_PATH, undefined, {
            params: this.buildParams(params),
        });
        return response.dashboard;
    }

    async getSubscriptions(params?: GetDashboardParams): Promise<DashboardSubscriptionModule> {
        const response = await this.client.getById<DashboardResponse<DashboardSubscriptionModule>>(
            `${BASE_PATH}/subscriptions`,
            undefined,
            { params: this.buildParams(params) }
        );
        return response.dashboard;
    }

    async getContent(params?: GetDashboardParams): Promise<DashboardContentModule> {
        const response = await this.client.getById<DashboardResponse<DashboardContentModule>>(
            `${BASE_PATH}/content`,
            undefined,
            { params: this.buildParams(params) }
        );
        return response.dashboard;
    }

    async getMagazine(params?: GetDashboardParams): Promise<DashboardMagazineModule> {
        const response = await this.client.getById<DashboardResponse<DashboardMagazineModule>>(
            `${BASE_PATH}/magazine`,
            undefined,
            { params: this.buildParams(params) }
        );
        return response.dashboard;
    }

    async getDiffusion(params?: Pick<GetDashboardParams, 'forceReload'>): Promise<DashboardDiffusionModule> {
        const response = await this.client.getById<DashboardResponse<DashboardDiffusionModule>>(
            `${BASE_PATH}/diffusion`,
            undefined,
            {
                params: {
                    ...(params?.forceReload && { forceReload: params.forceReload }),
                },
            }
        );
        return response.dashboard;
    }

    async getSubscribers(params?: GetDashboardParams): Promise<DashboardSubscribersModule> {
        const response = await this.client.getById<DashboardResponse<DashboardSubscribersModule>>(
            `${BASE_PATH}/subscribers`,
            undefined,
            { params: this.buildParams(params) }
        );
        return response.dashboard;
    }

    private buildParams(params?: GetDashboardParams): Record<string, string | boolean> {
        return {
            ...(params?.dateFrom && { dateFrom: params.dateFrom }),
            ...(params?.dateTo && { dateTo: params.dateTo }),
            ...(params?.forceReload && { forceReload: params.forceReload }),
        };
    }
}

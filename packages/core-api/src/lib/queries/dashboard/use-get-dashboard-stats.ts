import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DashboardOverview } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetDashboardParams } from '../../endpoints/dashboard';

export const getDashboardStats = async (params?: GetDashboardParams): Promise<DashboardOverview> => {
    return await maasApi.dashboard.getDashboard(params);
};

export const useGetDashboardStats = (
    params?: GetDashboardParams,
    options?: Omit<UseQueryOptions<DashboardOverview, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['dashboard', params],
        queryFn: () => getDashboardStats(params),
        ...options,
    });

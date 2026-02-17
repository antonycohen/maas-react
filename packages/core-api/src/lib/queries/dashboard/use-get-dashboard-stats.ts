import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DashboardStats } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetDashboardParams } from '../../endpoints/dashboard';

export const getDashboardStats = async (params?: GetDashboardParams): Promise<DashboardStats> => {
    return await maasApi.dashboard.getDashboard(params);
};

export const useGetDashboardStats = (
    params?: GetDashboardParams,
    options?: Omit<UseQueryOptions<DashboardStats, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['dashboard', params],
        queryFn: () => getDashboardStats(params),
        ...options,
    });

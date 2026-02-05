import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Plan } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getPlanById = async (params: GetQueryByIdParams<Plan>): Promise<Plan> => {
    return await maasApi.plans.getPlan(params);
};

export const useGetPlanById = (
    params: GetQueryByIdParams<Plan>,
    options?: Omit<UseQueryOptions<Plan, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['plan', params.id, params.fields],
        queryFn: () => getPlanById(params),
        ...options,
    });

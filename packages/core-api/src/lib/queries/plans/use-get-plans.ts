import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Plan } from '@maas/core-api-models';
import { ApiError, maasApi, GetPlansFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetPlansParams<S = undefined> = GetCollectionQueryParams<Plan, S> & {
    filters?: GetPlansFilter;
};

export const getPlans = async <S = undefined>(params: GetPlansParams<S>): Promise<ApiCollectionResponse<Plan>> => {
    return await maasApi.plans.getPlans(params as any);
};

export const useGetPlans = <S = undefined>(
    params: GetPlansParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Plan>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['plans', params],
        queryFn: () => getPlans(params),
        ...options,
    });

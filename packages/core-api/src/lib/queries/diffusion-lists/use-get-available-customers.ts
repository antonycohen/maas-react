import { ApiCollectionResponse } from '../../types';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export interface GetAvailableCustomersParams {
    diffusionListId: string;
    query?: string;
    offset?: number;
    limit?: number;
}

export const useGetAvailableCustomers = (
    params: GetAvailableCustomersParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<ReadCustomer>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['diffusion-list-available-customers', params.diffusionListId, params],
        queryFn: () =>
            maasApi.diffusionLists.getAvailableCustomers(params.diffusionListId, {
                query: params.query,
                offset: params.offset,
                limit: params.limit,
            }),
        ...options,
    });

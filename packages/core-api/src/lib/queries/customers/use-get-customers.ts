import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi, GetCustomersFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetCustomersParams<S = undefined> = GetCollectionQueryParams<ReadCustomer, S> & {
    filters?: GetCustomersFilter;
};

export const getCustomers = async <S = undefined>(
    params: GetCustomersParams<S>
): Promise<ApiCollectionResponse<ReadCustomer>> => {
    return await maasApi.customers.getCustomers(params as any);
};

export const useGetCustomers = <S = undefined>(
    params: GetCustomersParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<ReadCustomer>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['customers', params],
        queryFn: () => getCustomers(params),
        ...options,
    });

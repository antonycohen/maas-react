import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { GetQueryByIdParams } from '../../types';

export const getCustomerById = async (params: GetQueryByIdParams<ReadCustomer>): Promise<ReadCustomer> => {
    return await maasApi.customers.getCustomer(params);
};

export const useGetCustomerById = (
    params: GetQueryByIdParams<ReadCustomer>,
    options?: Omit<UseQueryOptions<ReadCustomer, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['customers', params.id, params.fields],
        queryFn: () => getCustomerById(params),
        ...options,
    });

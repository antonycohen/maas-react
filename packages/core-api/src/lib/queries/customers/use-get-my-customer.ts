import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { FieldQuery } from '../../types';

export const getMyCustomer = async (fields?: FieldQuery<ReadCustomer>): Promise<ReadCustomer> => {
    return await maasApi.customers.getMyCustomer(fields);
};

export const useGetMyCustomer = (
    fields?: FieldQuery<ReadCustomer>,
    options?: Omit<UseQueryOptions<ReadCustomer, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['customers', 'me', fields],
        queryFn: () => getMyCustomer(fields),
        ...options,
    });

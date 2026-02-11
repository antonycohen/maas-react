import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Quota } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const getCustomerQuotas = async (customerId: string): Promise<Quota[]> => {
    return await maasApi.customers.getCustomerQuotas(customerId);
};

export const useGetCustomerQuotas = (
    customerId: string,
    options?: Omit<UseQueryOptions<Quota[], ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['quotas', customerId],
        queryFn: () => getCustomerQuotas(customerId),
        ...options,
    });

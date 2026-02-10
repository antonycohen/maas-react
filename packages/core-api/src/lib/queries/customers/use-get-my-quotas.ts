import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Quota } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const getMyQuotas = async (): Promise<Quota[]> => {
    return await maasApi.customers.getMyQuotas();
};

export const useGetMyQuotas = (options?: Omit<UseQueryOptions<Quota[], ApiError>, 'queryKey'>) =>
    useQuery({
        queryKey: ['quotas', 'me'],
        queryFn: () => getMyQuotas(),
        ...options,
    });

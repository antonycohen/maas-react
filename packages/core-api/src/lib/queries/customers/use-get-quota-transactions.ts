import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { QuotaTransaction } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export interface GetQuotaTransactionsParams extends GetCollectionQueryParams<QuotaTransaction> {
    customerId: string;
    filters?: { operationType?: string };
}

export const getQuotaTransactions = async (
    params: GetQuotaTransactionsParams
): Promise<ApiCollectionResponse<QuotaTransaction>> => {
    const { customerId, ...rest } = params;
    return maasApi.customers.getQuotaTransactions(customerId, rest);
};

export const useGetQuotaTransactions = (
    params: GetQuotaTransactionsParams,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<QuotaTransaction>, ApiError>, 'queryKey' | 'queryFn'>
) => {
    return useQuery({
        queryKey: ['quota-transactions', params],
        queryFn: () => getQuotaTransactions(params),
        ...options,
    });
};

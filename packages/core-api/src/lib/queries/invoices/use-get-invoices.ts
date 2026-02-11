import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Invoice } from '@maas/core-api-models';
import { ApiError, maasApi, GetAdminInvoicesFilter } from '../../api';
import { ApiCollectionResponse, GetCollectionQueryParams } from '../../types';

export type GetInvoicesParams<S = undefined> = GetCollectionQueryParams<Invoice, S> & {
    filters?: GetAdminInvoicesFilter;
};

export const getInvoices = async <S = undefined>(
    params: GetInvoicesParams<S>
): Promise<ApiCollectionResponse<Invoice>> => {
    return await maasApi.invoices.getInvoices(
        params as GetCollectionQueryParams<Invoice> & { filters?: GetAdminInvoicesFilter }
    );
};

export const useGetInvoices = <S = undefined>(
    params: GetInvoicesParams<S>,
    options?: Omit<UseQueryOptions<ApiCollectionResponse<Invoice>, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['invoices', params],
        queryFn: () => getInvoices(params),
        ...options,
    });

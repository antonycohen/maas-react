import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { InvoiceListResponse } from '@maas/core-api-models';
import { ApiError, maasApi, GetMyInvoicesFilter } from '../../api';

export const getMyInvoices = async (filters?: GetMyInvoicesFilter): Promise<InvoiceListResponse> => {
    return await maasApi.invoices.getMyInvoices(filters);
};

export const useGetMyInvoices = (
    filters?: GetMyInvoicesFilter,
    options?: Omit<UseQueryOptions<InvoiceListResponse, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['invoices', 'me', filters],
        queryFn: () => getMyInvoices(filters),
        retry: (failureCount, error) => {
            if (error.code === 900) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });

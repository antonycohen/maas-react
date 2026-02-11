import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Invoice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import { FieldQuery } from '../../types';

export const getInvoiceById = async (invoiceId: string, fields?: FieldQuery<Invoice>): Promise<Invoice> => {
    return await maasApi.invoices.getInvoice(invoiceId, fields);
};

export const useGetInvoiceById = (
    invoiceId: string,
    fields?: FieldQuery<Invoice>,
    options?: Omit<UseQueryOptions<Invoice, ApiError>, 'queryKey'>
) =>
    useQuery({
        queryKey: ['invoice', invoiceId, fields],
        queryFn: () => getInvoiceById(invoiceId, fields),
        enabled: !!invoiceId,
        ...options,
    });

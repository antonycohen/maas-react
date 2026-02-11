import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { InvoicePayResponse } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const getInvoicePaymentUrl = async (invoiceId: string): Promise<InvoicePayResponse> => {
    return await maasApi.invoices.getInvoicePaymentUrl(invoiceId);
};

export const useGetInvoicePaymentUrl = (
    options?: Omit<UseMutationOptions<InvoicePayResponse, ApiError, string>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: (invoiceId: string) => getInvoicePaymentUrl(invoiceId),
        ...options,
    });
};

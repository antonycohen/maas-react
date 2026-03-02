import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export type DownloadMyInvoiceResult = { invoicePdf: string; hostedInvoiceUrl: string };

export const downloadMyInvoice = async (invoiceId: string): Promise<DownloadMyInvoiceResult> => {
    return await maasApi.invoices.downloadMyInvoice(invoiceId);
};

export const useDownloadMyInvoice = (
    options?: Omit<UseMutationOptions<DownloadMyInvoiceResult, ApiError, string>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: (invoiceId: string) => downloadMyInvoice(invoiceId),
        ...options,
    });
};

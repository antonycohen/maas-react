import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export interface DownloadInvoiceResult {
    invoicePdf: string;
    hostedInvoiceUrl: string;
}

export const downloadInvoice = async (invoiceId: string): Promise<DownloadInvoiceResult> => {
    return await maasApi.invoices.downloadInvoice(invoiceId);
};

export const useDownloadInvoice = (
    options?: Omit<UseMutationOptions<DownloadInvoiceResult, ApiError, string>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: (invoiceId: string) => downloadInvoice(invoiceId),
        ...options,
    });
};

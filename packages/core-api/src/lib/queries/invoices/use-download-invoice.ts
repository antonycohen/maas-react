import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
    return await maasApi.invoices.downloadInvoice(invoiceId);
};

export const useDownloadInvoice = (options?: Omit<UseMutationOptions<Blob, ApiError, string>, 'mutationFn'>) => {
    return useMutation({
        mutationFn: (invoiceId: string) => downloadInvoice(invoiceId),
        ...options,
    });
};

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const downloadMyInvoice = async (invoiceId: string): Promise<Blob> => {
    return await maasApi.invoices.downloadMyInvoice(invoiceId);
};

export const useDownloadMyInvoice = (options?: Omit<UseMutationOptions<Blob, ApiError, string>, 'mutationFn'>) => {
    return useMutation({
        mutationFn: (invoiceId: string) => downloadMyInvoice(invoiceId),
        ...options,
    });
};

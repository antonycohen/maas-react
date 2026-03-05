import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const useSendInvoice = (
    options?: Omit<UseMutationOptions<{ success: boolean }, ApiError, string>, 'mutationFn'>
) => {
    return useMutation({
        ...options,
        mutationFn: (invoiceId: string) => maasApi.invoices.sendInvoice(invoiceId),
    });
};

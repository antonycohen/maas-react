import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Invoice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const usePayInvoice = (options?: Omit<UseMutationOptions<Invoice, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invoiceId: string) => maasApi.invoices.payInvoice(invoiceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
        ...options,
    });
};

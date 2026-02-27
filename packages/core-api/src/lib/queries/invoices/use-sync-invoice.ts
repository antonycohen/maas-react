import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Invoice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const useSyncInvoice = (options?: Omit<UseMutationOptions<Invoice, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: (invoiceId: string) => maasApi.invoices.syncInvoice(invoiceId),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

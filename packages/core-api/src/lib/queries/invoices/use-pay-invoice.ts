import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Invoice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export interface PayInvoiceParams {
    invoiceId: string;
    paymentReference?: string;
    paymentMethod?: string;
}

export const usePayInvoice = (
    options?: Omit<UseMutationOptions<Invoice, ApiError, PayInvoiceParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: ({ invoiceId, paymentReference, paymentMethod }: PayInvoiceParams) =>
            maasApi.invoices.payInvoice(invoiceId, { paymentReference, paymentMethod }),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['quotas'] });
            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

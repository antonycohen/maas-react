import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type RenewSubscriptionParams = {
    subscriptionId: string;
    paymentMethod?: string;
};

export const renewSubscription = async ({
    subscriptionId,
    paymentMethod,
}: RenewSubscriptionParams): Promise<Subscription> => {
    return await maasApi.subscriptions.renewSubscription(subscriptionId, paymentMethod ? { paymentMethod } : undefined);
};

export const useRenewSubscription = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, RenewSubscriptionParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: renewSubscription,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', variables.subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['quotas'] });
            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

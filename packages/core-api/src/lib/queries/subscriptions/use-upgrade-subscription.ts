import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpgradeSubscriptionParams = {
    subscriptionId: string;
    data: {
        priceIds: string[];
        paymentMethod?: string;
        daysUntilDue?: number;
        metadata?: Record<string, unknown>;
    };
};

export const useUpgradeSubscription = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, UpgradeSubscriptionParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: ({ subscriptionId, data }: UpgradeSubscriptionParams) =>
            maasApi.subscriptions.upgradeSubscription(subscriptionId, data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', variables.subscriptionId] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['quotas'] });
            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
    });
};

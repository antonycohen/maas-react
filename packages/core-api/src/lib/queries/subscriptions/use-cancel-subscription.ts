import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const cancelSubscriptionAtPeriodEnd = async (subscriptionId: string): Promise<Subscription> => {
    return await maasApi.subscriptions.cancelSubscriptionAtPeriodEnd(subscriptionId);
};

export const useCancelSubscriptionAtPeriodEnd = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, string>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelSubscriptionAtPeriodEnd,
        onSuccess: (_, subscriptionId) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', subscriptionId] });
        },
        ...options,
    });
};

export const cancelSubscriptionImmediately = async (subscriptionId: string): Promise<Subscription> => {
    return await maasApi.subscriptions.cancelSubscriptionImmediately(subscriptionId);
};

export const useCancelSubscriptionImmediately = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, string>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelSubscriptionImmediately,
        onSuccess: (_, subscriptionId) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', subscriptionId] });
        },
        ...options,
    });
};

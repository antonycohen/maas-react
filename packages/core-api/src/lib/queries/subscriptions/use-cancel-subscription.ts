import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type CancelSubscriptionParams = {
    subscriptionId: string;
    cancelReason?: string;
};

export const cancelSubscriptionAtPeriodEnd = async (params: CancelSubscriptionParams): Promise<Subscription> => {
    return await maasApi.subscriptions.cancelSubscriptionAtPeriodEnd(params.subscriptionId, params.cancelReason);
};

export const useCancelSubscriptionAtPeriodEnd = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, CancelSubscriptionParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelSubscriptionAtPeriodEnd,
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', params.subscriptionId] });
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

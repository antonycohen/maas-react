import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const uncancelSubscription = async (subscriptionId: string): Promise<Subscription> => {
    return await maasApi.subscriptions.uncancelSubscription(subscriptionId);
};

export const useUncancelSubscription = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, string>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uncancelSubscription,
        onSuccess: (_, subscriptionId) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', subscriptionId] });
        },
        ...options,
    });
};

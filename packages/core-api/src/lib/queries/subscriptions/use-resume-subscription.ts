import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const resumeSubscription = async (subscriptionId: string): Promise<Subscription> => {
    return await maasApi.subscriptions.resumeSubscription(subscriptionId);
};

export const useResumeSubscription = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, string>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: resumeSubscription,
        onSuccess: (_, subscriptionId) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', subscriptionId] });
        },
        ...options,
    });
};

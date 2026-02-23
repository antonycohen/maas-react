import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@maas/core-api-models';
import { ApiError, maasApi, CreateCustomerSubscriptionData } from '../../api';

export type CreateCustomerSubscriptionParams = {
    customerId: string;
    data: CreateCustomerSubscriptionData;
};

export const useCreateCustomerSubscription = (
    options?: Omit<UseMutationOptions<Subscription, ApiError, CreateCustomerSubscriptionParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, data }: CreateCustomerSubscriptionParams) =>
            maasApi.customers.createCustomerSubscription(customerId, data),
        onSuccess: (_, { customerId }) => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['quotas', customerId] });
        },
        ...options,
    });
};

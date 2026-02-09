import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi, type CreateCheckoutSession, type CheckoutSession } from '../../api';

export const createCheckoutSession = async (data: CreateCheckoutSession): Promise<CheckoutSession> => {
    return await maasApi.checkoutSessions.createCheckoutSession(data);
};

export const useCreateCheckoutSession = (
    options?: Omit<UseMutationOptions<CheckoutSession, ApiError, CreateCheckoutSession>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: createCheckoutSession,
        ...options,
    });
};

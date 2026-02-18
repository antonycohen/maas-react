import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi, type CreatePortalSession, type PaymentMethodPortalSession } from '../../api';

export const createPaymentMethodUpdateSession = async (
    data: CreatePortalSession
): Promise<PaymentMethodPortalSession> => {
    return await maasApi.portalSessions.createPaymentMethodUpdateSession(data);
};

export const useCreatePaymentMethodUpdateSession = (
    options?: Omit<UseMutationOptions<PaymentMethodPortalSession, ApiError, CreatePortalSession>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: createPaymentMethodUpdateSession,
        ...options,
    });
};

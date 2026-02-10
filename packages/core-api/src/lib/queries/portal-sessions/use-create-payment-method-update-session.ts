import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi, type CreatePortalSession, type PortalSession } from '../../api';

export const createPaymentMethodUpdateSession = async (data: CreatePortalSession): Promise<PortalSession> => {
    return await maasApi.portalSessions.createPaymentMethodUpdateSession(data);
};

export const useCreatePaymentMethodUpdateSession = (
    options?: Omit<UseMutationOptions<PortalSession, ApiError, CreatePortalSession>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: createPaymentMethodUpdateSession,
        ...options,
    });
};

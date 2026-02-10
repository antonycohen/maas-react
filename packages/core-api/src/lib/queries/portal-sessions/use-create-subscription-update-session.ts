import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, maasApi, type CreatePortalSession, type PortalSession } from '../../api';

export const createSubscriptionUpdateSession = async (data: CreatePortalSession): Promise<PortalSession> => {
    return await maasApi.portalSessions.createSubscriptionUpdateSession(data);
};

export const useCreateSubscriptionUpdateSession = (
    options?: Omit<UseMutationOptions<PortalSession, ApiError, CreatePortalSession>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: createSubscriptionUpdateSession,
        ...options,
    });
};

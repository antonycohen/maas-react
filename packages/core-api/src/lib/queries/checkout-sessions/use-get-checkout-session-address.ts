import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError, maasApi, type CheckoutSessionAddress } from '../../api';

export const getCheckoutSessionAddress = async (sessionId: string): Promise<CheckoutSessionAddress> => {
    return await maasApi.checkoutSessions.getCheckoutSessionAddress(sessionId);
};

export const useGetCheckoutSessionAddress = (
    sessionId: string | null,
    options?: Omit<UseQueryOptions<CheckoutSessionAddress, ApiError>, 'queryKey' | 'queryFn'>
) =>
    useQuery({
        queryKey: ['checkout-sessions', sessionId, 'address'],
        queryFn: () => getCheckoutSessionAddress(sessionId!),
        enabled: !!sessionId,
        retry: false,
        ...options,
    });

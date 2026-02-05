import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Price } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const syncPrice = async (priceId: string): Promise<Price> => {
    return await maasApi.prices.syncPrice(priceId);
};

export const useSyncPrice = (options?: Omit<UseMutationOptions<Price, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncPrice,
        onSuccess: (_, priceId) => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            queryClient.invalidateQueries({ queryKey: ['price', priceId] });
        },
        ...options,
    });
};

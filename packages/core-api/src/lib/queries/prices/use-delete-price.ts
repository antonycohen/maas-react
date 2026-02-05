import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deletePrice = async (priceId: string): Promise<void> => {
    return await maasApi.prices.deletePrice(priceId);
};

export const useDeletePrice = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePrice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
        },
        ...options,
    });
};

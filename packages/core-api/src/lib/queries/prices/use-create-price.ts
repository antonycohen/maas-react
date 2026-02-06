import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Price, CreatePrice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createPrice = async (data: CreatePrice): Promise<Price> => {
    return await maasApi.prices.createPrice(data);
};

export const useCreatePrice = (options?: Omit<UseMutationOptions<Price, ApiError, CreatePrice>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPrice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
        },
        ...options,
    });
};

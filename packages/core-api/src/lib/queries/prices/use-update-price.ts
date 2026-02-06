import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Price, UpdatePrice } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdatePriceParams = {
    priceId: string;
    data: UpdatePrice;
};

export const updatePrice = async ({ priceId, data }: UpdatePriceParams): Promise<Price> => {
    return await maasApi.prices.updatePrice(priceId, data);
};

export const useUpdatePrice = (
    options?: Omit<UseMutationOptions<Price, ApiError, UpdatePriceParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePrice,
        onSuccess: (_, { priceId }) => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            queryClient.invalidateQueries({ queryKey: ['price', priceId] });
        },
        ...options,
    });
};

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export interface DetachFeatureFromProductParams {
    productId: string;
    productFeatureId: string;
}

export const detachFeatureFromProduct = async (params: DetachFeatureFromProductParams): Promise<void> => {
    return await maasApi.products.detachFeature(params.productId, params.productFeatureId);
};

export const useDetachFeatureFromProduct = (
    options?: Omit<UseMutationOptions<void, ApiError, DetachFeatureFromProductParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: detachFeatureFromProduct,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'features'] });
        },
        ...options,
    });
};

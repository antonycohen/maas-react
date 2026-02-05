import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export interface AttachFeatureToProductParams {
    productId: string;
    featureId: string;
}

export const attachFeatureToProduct = async (params: AttachFeatureToProductParams): Promise<{ id: string }> => {
    return await maasApi.products.attachFeature(params.productId, params.featureId);
};

export const useAttachFeatureToProduct = (
    options?: Omit<UseMutationOptions<{ id: string }, ApiError, AttachFeatureToProductParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: attachFeatureToProduct,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'features'] });
        },
        ...options,
    });
};

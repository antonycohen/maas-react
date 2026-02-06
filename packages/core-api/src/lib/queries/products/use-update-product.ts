import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Product, UpdateProduct } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateProductParams = {
    productId: string;
    data: UpdateProduct;
};

export const updateProduct = async ({ productId, data }: UpdateProductParams): Promise<Product> => {
    return await maasApi.products.updateProduct(productId, data);
};

export const useUpdateProduct = (
    options?: Omit<UseMutationOptions<Product, ApiError, UpdateProductParams>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
        },
        ...options,
    });
};

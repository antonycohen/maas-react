import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { Product, CreateProduct } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createProduct = async (data: CreateProduct): Promise<Product> => {
    return await maasApi.products.createProduct(data);
};

export const useCreateProduct = (
    options?: Omit<UseMutationOptions<Product, ApiError, CreateProduct>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        ...options,
    });
};

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteProduct = async (productId: string): Promise<void> => {
    return await maasApi.products.deleteProduct(productId);
};

export const useDeleteProduct = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        ...options,
    });
};

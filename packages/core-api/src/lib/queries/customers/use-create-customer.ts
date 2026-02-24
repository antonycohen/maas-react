import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { CreateCustomer, ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createCustomer = async (data: CreateCustomer): Promise<ReadCustomer> => {
    return await maasApi.customers.createCustomer(data);
};

export const useCreateCustomer = (
    options?: Omit<UseMutationOptions<ReadCustomer, ApiError, CreateCustomer>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};

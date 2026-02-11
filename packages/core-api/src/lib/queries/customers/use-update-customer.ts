import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import type { UpdateMyCustomerData } from '../../endpoints/customers';

type UpdateCustomerVariables = {
    customerId: string;
    data: UpdateMyCustomerData;
};

export const updateCustomer = async ({ customerId, data }: UpdateCustomerVariables): Promise<ReadCustomer> => {
    return await maasApi.customers.updateCustomer(customerId, data);
};

export const useUpdateCustomer = (
    options?: Omit<UseMutationOptions<ReadCustomer, ApiError, UpdateCustomerVariables>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};

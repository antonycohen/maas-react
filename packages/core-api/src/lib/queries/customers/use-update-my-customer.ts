import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ReadCustomer } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';
import type { UpdateMyCustomerData } from '../../endpoints/customers';

export const updateMyCustomer = async (data: UpdateMyCustomerData): Promise<ReadCustomer> => {
    return await maasApi.customers.updateMyCustomer(data);
};

export const useUpdateMyCustomer = (
    options?: Omit<UseMutationOptions<ReadCustomer, ApiError, UpdateMyCustomerData>, 'mutationFn'>
) => {
    return useMutation({
        mutationFn: updateMyCustomer,
        ...options,
    });
};

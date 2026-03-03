import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { User } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type CreateUserCustomerParams = {
    userId: string;
};

export const useCreateUserCustomer = (
    options?: Omit<UseMutationOptions<User, ApiError, CreateUserCustomerParams>, 'mutationFn'>
) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateUserCustomerParams) => maasApi.users.createCustomer(params.userId),
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', args[1].userId] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};

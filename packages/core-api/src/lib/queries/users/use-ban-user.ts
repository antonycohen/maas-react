import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { User } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type BanUserParams = {
    userId: string;
};

export const useBanUser = (options?: Omit<UseMutationOptions<User, ApiError, BanUserParams>, 'mutationFn'>) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: BanUserParams) => maasApi.users.banUser(params.userId),
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', args[1].userId] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};

export const useUnbanUser = (options?: Omit<UseMutationOptions<User, ApiError, BanUserParams>, 'mutationFn'>) => {
    const { onSuccess, ...restOptions } = options || {};
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: BanUserParams) => maasApi.users.unbanUser(params.userId),
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', args[1].userId] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};
